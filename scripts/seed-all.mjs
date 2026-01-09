import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

const { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configurable sizes for realistic seed
const TOTAL_USERS = 1000; // approximate
const ADMIN_COUNT = 1;
const TEACHER_COUNT = 20;
const STUDENT_COUNT = TOTAL_USERS - ADMIN_COUNT - TEACHER_COUNT; // ~979
const COURSES_PER_TEACHER_MIN = 2;
const COURSES_PER_TEACHER_MAX = 4;
const STUDENTS_PER_COURSE_MIN = 20;
const STUDENTS_PER_COURSE_MAX = 40;
const ATTENDANCE_DAYS = 30;
const TESTS_PER_COURSE = 3;

// chunk sizes to keep PostgREST payload reasonable
const CHUNK_SIZE = 1000;
const CONCURRENCY = 50; // admin createUser rate limiting guard

function chunk(items, size = CHUNK_SIZE) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function upsertChunked(table, rows, { onConflict } = {}) {
  for (const c of chunk(rows)) {
    const { error } = await supabase
      .from(table)
      .upsert(c, onConflict ? { onConflict } : undefined);
    if (error) throw new Error(`Upsert ${table} failed: ${error.message}`);
  }
}

async function insertChunked(table, rows) {
  for (const c of chunk(rows)) {
    const { error } = await supabase.from(table).insert(c);
    if (error) throw new Error(`Insert ${table} failed: ${error.message}`);
  }
}

async function deleteAll(table) {
  const { error } = await supabase.from(table).delete().not("id", "is", null);
  if (error) throw new Error(`Delete ${table} failed: ${error.message}`);
}

async function createUserWithProfileRole({ email, password, role, full_name, phone }) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone },
    app_metadata: { role },
  });
  if (error) throw new Error(`Create user ${email} failed: ${error.message}`);
  const user = data.user;
  await supabase.from("profiles").upsert({ user_id: user.id, full_name, phone });
  await supabase.from("user_roles").upsert({ user_id: user.id, role });
  return user.id;
}

function generateCourse(teacherId) {
  const names = [
    "Hifz Level",
    "Tajwid Basics",
    "Quran Recitation",
    "Makharij Mastery",
    "Memorization Track",
  ];
  const base = faker.helpers.arrayElement(names);
  const lvl = faker.number.int({ min: 1, max: 5 });
  return {
    id: faker.string.uuid(),
    name: `${base} ${lvl}`,
    description: faker.lorem.sentence(),
    teacher_id: teacherId,
  };
}

async function seedCourses(teacherIds) {
  const courses = [];
  for (const tId of teacherIds) {
    const count = faker.number.int({ min: COURSES_PER_TEACHER_MIN, max: COURSES_PER_TEACHER_MAX });
    for (let i = 0; i < count; i++) courses.push(generateCourse(tId));
  }
  await upsertChunked("courses", courses);
  console.log(`Courses seeded: ${courses.length}`);
  return courses;
}

async function seedEnrollments(courses, studentIds) {
  const rows = [];
  for (const course of courses) {
    const count = faker.number.int({ min: STUDENTS_PER_COURSE_MIN, max: STUDENTS_PER_COURSE_MAX });
    const sampled = faker.helpers.arrayElements(studentIds, count);
    for (const sid of sampled) rows.push({ course_id: course.id, student_id: sid });
  }
  await upsertChunked("enrollments", rows, { onConflict: "student_id,course_id" });
  console.log(`Enrollments seeded: ${rows.length}`);
  return rows;
}

async function seedAttendance(enrollments) {
  const records = [];
  const today = new Date();
  for (let d = 0; d < ATTENDANCE_DAYS; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);
    for (const { student_id, course_id } of enrollments) {
      // realistic distribution
      const r = Math.random();
      const status = r < 0.85 ? "present" : r < 0.95 ? "late" : "absent";
      records.push({ student_id, course_id, date: dateStr, status });
    }
    // flush each day to control payload size
    await upsertChunked("attendance", records.splice(0), { onConflict: "student_id,date,course_id" });
    console.log(`Attendance seeded for ${dateStr}`);
  }
}

async function seedTests(courses, enrollmentsByCourse, teacherByCourse) {
  const tests = [];
  for (const course of courses) {
    for (let i = 0; i < TESTS_PER_COURSE; i++) {
      const scheduled_at = faker.date.soon({ days: 21 }).toISOString();
      tests.push({
        id: faker.string.uuid(),
        title: `Assessment ${i + 1}: ${faker.word.noun()}`,
        description: faker.lorem.sentence(),
        scheduled_at,
        max_score: 100,
        course_id: course.id,
        teacher_id: teacherByCourse.get(course.id),
      });
    }
  }
  await upsertChunked("tests", tests);

  const results = [];
  for (const t of tests) {
    const enrolled = enrollmentsByCourse.get(t.course_id) || [];
    for (const sid of enrolled) {
      const score = faker.number.int({ min: 40, max: 100 });
      const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D";
      results.push({
        test_id: t.id,
        student_id: sid,
        score,
        grade,
        feedback: faker.helpers.arrayElement([
          "Excellent work",
          "Good effort",
          "Needs improvement",
        ]),
      });
    }
    // flush per test to limit payload size
    await upsertChunked("test_results", results.splice(0));
  }
  console.log(`Tests and results seeded: ${tests.length}`);
}

async function seedMemorization(studentIds) {
  const records = [];
  for (const sid of studentIds) {
    const entries = faker.number.int({ min: 2, max: 5 });
    for (let i = 0; i < entries; i++) {
      const surah_number = faker.number.int({ min: 1, max: 114 });
      const ayah_from = faker.number.int({ min: 1, max: 10 });
      const ayah_to = ayah_from + faker.number.int({ min: 5, max: 25 });
      const status = faker.helpers.arrayElement(["memorizing", "memorized", "revision"]);
      const grade = status === "memorized" ? faker.helpers.arrayElement(["A", "B", "C"]) : null;
      records.push({
        student_id: sid,
        surah_number,
        ayah_from,
        ayah_to,
        status,
        notes: faker.lorem.sentence(),
        grade,
      });
    }
  }
  await insertChunked("memorization_progress", records);
  console.log(`Memorization progress seeded: ${records.length}`);
}

async function clearDatabase() {
  console.log("Clearing database tables...");
  // Order matters due to FKs
  await deleteAll("test_results");
  await deleteAll("tests");
  await deleteAll("attendance");
  await deleteAll("enrollments");
  await deleteAll("courses");
  await deleteAll("memorization_progress");
  await deleteAll("user_roles");
  await deleteAll("profiles");

  console.log("Deleting auth users...");
  // paginate through and delete
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`List users failed: ${error.message}`);
    const users = data?.users || [];
    if (users.length === 0) break;
    for (const u of users) {
      const del = await supabase.auth.admin.deleteUser(u.id);
      if (del.error) throw new Error(`Delete user ${u.id} failed: ${del.error.message}`);
    }
    console.log(`Deleted users page ${page}: ${users.length}`);
    page++;
  }
  console.log("Database cleared.");
}

async function main() {
  // Always clear DB before seeding
  // await clearDatabase();

  // // Create users: admins, teachers, students
  // const adminEmails = Array.from({ length: ADMIN_COUNT }, (_, i) => `admin${i + 1}@example.com`);
  // const teacherEmails = Array.from({ length: TEACHER_COUNT }, (_, i) => `teacher${i + 1}@example.com`);
  // const studentEmails = Array.from({ length: STUDENT_COUNT }, (_, i) => `student${i + 1}@example.com`);

  // const adminIds = [];
  // const teacherIds = [];
  // const studentIds = [];

  // async function createUsers(emails, role) {
  //   const ids = [];
  //   let idx = 0;
  //   while (idx < emails.length) {
  //     const batch = emails.slice(idx, idx + CONCURRENCY);
  //     await Promise.all(
  //       batch.map(async (email) => {
  //         const full_name = faker.person.fullName();
  //         const phone = faker.phone.number();
  //         const password = "Password123!";
  //         const id = await createUserWithProfileRole({ email, password, role, full_name, phone });
  //         ids.push(id);
  //       })
  //     );
  //     idx += batch.length;
  //     console.log(`Created ${role} batch: ${ids.length}/${emails.length}`);
  //   }
  //   return ids;
  // }

  // console.log("Creating admins...");
  // adminIds.push(...(await createUsers(adminEmails, "admin")));
  // console.log("Creating teachers...");
  // teacherIds.push(...(await createUsers(teacherEmails, "teacher")));
  // console.log("Creating students...");
  // studentIds.push(...(await createUsers(studentEmails, "student")));

  // if (teacherIds.length === 0 || studentIds.length === 0) {
  //   console.error("Teacher or students missing; aborting");
  //   process.exit(1);
  // }

  // // Courses
  // const courses = await seedCourses(teacherIds);
  // const teacherByCourse = new Map(courses.map((c) => [c.id, c.teacher_id]));

  // // Enrollments
  // const enrollments = await seedEnrollments(courses, studentIds);
  // const enrollmentsByCourse = new Map();
  // for (const e of enrollments) {
  //   const list = enrollmentsByCourse.get(e.course_id) || [];
  //   list.push(e.student_id);
  //   enrollmentsByCourse.set(e.course_id, list);
  // }

  // // Attendance over last 30 days
  // await seedAttendance(enrollments);

  // // Tests and results
  // await seedTests(courses, enrollmentsByCourse, teacherByCourse);

  // Memorization progress
  await seedMemorization(studentIds);

  console.log(`Seed completed. Admins: ${adminIds.length}, Teachers: ${teacherIds.length}, Students: ${studentIds.length}`);
}

main().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});

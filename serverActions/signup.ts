'use server'


async function Signup(data:FormData) {
    // hash the password as well.
    // just take the email, password and store it in the db.
    // @unique tag in schema.prisma will ensure that the the email is unique
}
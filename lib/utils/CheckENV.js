module.exports = () => {
  if(!process.env.STAGE) {
    console.error('STAGE environment variable is required')
    process.exit(1)
  }

  if(!process.env.HOSTNAME) {
    console.error('HOSTNAME environment variable is required')
    process.exit(1)
  }

  if(!process.env.PORT) {
    console.error('PORT environment variable is required')
    process.exit(1)
  }

  if(!process.env.NEXTAUTH_URL) {
    console.error('NEXTAUTH_URL environment variable is required')
    process.exit(1)
  }

  if(!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET environment variable is required')
    process.exit(1)
  }

  if(!process.env.REMOTE_CHECKOUT_DIRECTORY) {
    console.error('REMOTE_CHECKOUT_DIRECTORY environment variable is required')
    process.exit(1)
  }

  if(!process.env.LOCAL_STORAGE_DIRECTORY) {
    console.error('LOCAL_STORAGE_DIRECTORY environment variable is required')
    process.exit(1)
  }
}
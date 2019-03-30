const AppConstants = {
    AVATAR_URL:'https://dl.dropboxusercontent.com/s/3wicwhrw7e9fdvs/blob%20%2826%29.jpg?dl=0',
    UPLOAD_FILE_SIZE_LIMIT: 150 * 1024 * 1024,
    REGEX_USERNAME: /^[a-z0-9_-]{3,16}$/,
    REGEX_PASSWORD: /(?=.{8,})/,
    REGEX_NAME:  /^(?!\s*$).+/,
    ACCESS_TOKEN_DROPBOX: 'wXLQd5nNy4AAAAAAAAAAEGey-alEMw-sjQJgEjL07M9zsZtotxqGBqc1f-ACSVaY'



}
module.exports = AppConstants;
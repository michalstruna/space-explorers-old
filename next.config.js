/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: ['./styles'],
        prependData: `@import "variables.scss", "mixins.scss";`,
    }
}

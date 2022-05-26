console.log(process.env.TAILWIND_MODE);
module.exports = {
    mode: process.env.TAILWIND_MODE ? 'jit' : '',
    content: [
        './angular/playgrond/src/**/*.{html,ts}',
    ],
    theme: {
        extend: {},
    },
    plugins: []
}

module.exports = {
    mode: process.env.TAILWIND_MODE ? 'jit' : '',
    content: [
        './angular/playground/src/**/*.{html,ts}',
    ],
    theme: {
        extend: {},
    },
    plugins: []
}

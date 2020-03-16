const mix                   = require('laravel-mix');

// Transpile dependencies that has ES6 code format
const transpileDependencies = [
    'tempusdominus-core'
];
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.extract([
        'jquery',
        'jquery.scrollto',
    ]);

mix.js('resources/assets/js/vendor.js', 'public/build/js')
    .js('resources/assets/js/common.js', 'public/build/js/app.js')
    .js(
        [
            'node_modules/lazysizes/lazysizes.js',
            'node_modules/lazysizes/plugins/respimg/ls.respimg.js'
        ],
        'public/build/js/lazysizes.js')
    .js('resources/assets/js/styleguide.js', 'public/build/js/styleguide.js');

mix.sass('resources/assets/sass/vendor.sass', 'public/build/css')
    .sass('resources/assets/sass/app.sass', 'public/build/css')
    .sass('resources/assets/sass/styleguide.sass', 'public/build/css')
    .options({
        processCssUrls: false
    });

mix.webpackConfig(webpack => {
    return {
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    exclude: new RegExp(`node_modules/(?!(${transpileDependencies.join('|')})/).*`),
                    use: [
                        {
                            loader: 'babel-loader',
                            options: mix.config.babel()
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^.\/(en)$/),
            new webpack.SourceMapDevToolPlugin({
              exclude: ['popper.js']
            })
        ]
    };
});

mix.options({
    // processCssUrls: false,
    fileLoaderDirs: {
        images: 'build/images',
        fonts: 'build/fonts'
    }
});

// Enable compiled assets versioning
if (mix.inProduction()) {
    mix.version();
}

// Disable build notifications
mix.disableNotifications();


import { VueLoaderPlugin } from "vue-loader";
import __dirname from "./dirname.js";
import path from 'path';

export default {
    mode: 'development',
    entry: './src/Profile/profile.js',
    cache: {
        type: 'filesystem',
        allowCollectingMemory: true,
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    output: {
        path: path.resolve(__dirname, 'public', 'javascripts', 'Profile'),
        filename: 'profile.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
}
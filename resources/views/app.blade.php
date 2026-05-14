<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'SIM Aduan') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Telex Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Telex&display=swap" rel="stylesheet">

        <!-- Font Awesome 6 -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

        <style>
            /* Force regular weight on all elements */
            * {
                font-weight: 400 !important;
                font-style: normal !important;
            }

            *:not(.capitalize) {
                text-transform: none !important;
            }

            .capitalize {
                text-transform: capitalize !important;
            }

            /* Ensure typically bold elements are regular */
            h1, h2, h3, h4, h5, h6, b, strong, th, td, button, .font-medium, .font-semibold, .font-bold {
                font-weight: 400 !important;
            }

            /* Keep icons visible - Font Awesome Solid needs 900 */
            .fas, .fab, .fa-solid, .fa-brands {
                font-weight: 900 !important;
            }
            .far, .fa-regular {
                font-weight: 400 !important;
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        @inertiaHead
    </head>
    <body class="font-sans antialiased" style="font-family: 'Telex', sans-serif; font-size: 14px;">
        @inertia
    </body>
</html>

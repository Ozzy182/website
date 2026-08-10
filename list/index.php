<?php

/*
 * Website Page List
 * Place this file at:
 * /list/index.php
 */

$rootDir = realpath(__DIR__ . '/..');

$excludedDirectories = [
    'list',
    'assets',
    '.git',
    '.github',
    '.vscode',
    'node_modules',
];

$allowedExtensions = [
    'html',
    'htm',
    'php',
];

$pages = [];


/**
 * Check whether a directory should be ignored.
 */
function isExcludedDirectory($name, $excludedDirectories)
{
    return in_array($name, $excludedDirectories, true);
}


/**
 * Convert absolute filesystem path to website-relative path.
 */
function getRelativePath($path, $rootDir)
{
    $relative = str_replace('\\', '/', substr($path, strlen($rootDir)));

    return '/' . ltrim($relative, '/');
}


/**
 * Recursively scan website folders.
 */
function scanPages($directory, $rootDir, $excludedDirectories, $allowedExtensions, &$pages)
{
    $items = scandir($directory);

    if ($items === false) {
        return;
    }

    foreach ($items as $item) {

        if ($item === '.' || $item === '..') {
            continue;
        }

        $fullPath = $directory . DIRECTORY_SEPARATOR . $item;

        /*
         * Directory
         */
        if (is_dir($fullPath)) {

            if (isExcludedDirectory($item, $excludedDirectories)) {
                continue;
            }

            /*
             * Check if folder itself is a page.
             *
             * Example:
             * /bali/index.html
             * becomes:
             * /bali/
             */
            $indexFiles = [
                'index.html',
                'index.htm',
                'index.php',
            ];

            foreach ($indexFiles as $indexFile) {

                if (is_file($fullPath . DIRECTORY_SEPARATOR . $indexFile)) {

                    $relative = getRelativePath($fullPath, $rootDir);

                    $pages[] = [
                        'title' => trim($relative, '/'),
                        'url'   => rtrim($relative, '/') . '/',
                    ];

                    break;
                }
            }

            /*
             * Scan folders inside this folder too.
             */
            scanPages(
                $fullPath,
                $rootDir,
                $excludedDirectories,
                $allowedExtensions,
                $pages
            );

            continue;
        }


        /*
         * Normal files
         */
        if (is_file($fullPath)) {

            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));

            if (!in_array($extension, $allowedExtensions, true)) {
                continue;
            }

            /*
             * Root index is handled separately as Homepage.
             */
            if (
                $directory === $rootDir &&
                in_array($item, ['index.html', 'index.htm', 'index.php'], true)
            ) {
                continue;
            }

            /*
             * Don't separately show index files inside folders.
             *
             * /bali/index.html
             * should show as /bali/
             * not /bali/index.html
             */
            if (
                in_array($item, ['index.html', 'index.htm', 'index.php'], true)
                && $directory !== $rootDir
            ) {
                continue;
            }

            $relative = getRelativePath($fullPath, $rootDir);

            $pages[] = [
                'title' => $relative,
                'url'   => $relative,
            ];
        }
    }
}


/*
 * Homepage
 */
$pages[] = [
    'title' => 'Homepage',
    'url'   => '/',
];


/*
 * Scan rest of website
 */
scanPages(
    $rootDir,
    $rootDir,
    $excludedDirectories,
    $allowedExtensions,
    $pages
);


/*
 * Sort pages, keeping Homepage first.
 */
$homepage = array_shift($pages);

usort($pages, function ($a, $b) {
    return strnatcasecmp($a['url'], $b['url']);
});

array_unshift($pages, $homepage);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Website Pages</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 20px;
            background: #f5f6f8;
            color: #222;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Arial,
                sans-serif;
        }

        .container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
        }

        h1 {
            margin: 0 0 8px;
            font-size: 28px;
        }

        .count {
            margin-bottom: 30px;
            color: #777;
            font-size: 14px;
        }

        .page-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .page {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;

            padding: 16px 18px;

            background: #fff;
            border: 1px solid #e4e6e8;
            border-radius: 8px;

            text-decoration: none;
            color: #222;

            transition:
                border-color .2s,
                box-shadow .2s,
                transform .2s;
        }

        .page:hover {
            border-color: #aaa;
            box-shadow: 0 4px 14px rgba(0, 0, 0, .06);
            transform: translateY(-1px);
        }

        .page-title {
            font-weight: 600;
        }

        .page-url {
            color: #777;
            font-family: monospace;
            font-size: 13px;
            word-break: break-all;
        }

        .arrow {
            flex-shrink: 0;
            color: #999;
            font-size: 20px;
        }

        @media (max-width: 600px) {

            body {
                padding: 25px 15px;
            }

            .page {
                align-items: flex-start;
            }

            .page-url {
                margin-top: 4px;
            }
        }
    </style>
</head>

<body>

<div class="container">

    <h1>Website Pages</h1>

    <div class="count">
        <?php echo count($pages); ?> pages
    </div>

    <div class="page-list">

        <?php foreach ($pages as $page): ?>

            <a
                class="page"
                href="<?php echo htmlspecialchars($page['url'], ENT_QUOTES, 'UTF-8'); ?>"
                target="_blank"
            >

                <div>

                    <div class="page-title">
                        <?php echo htmlspecialchars($page['title'], ENT_QUOTES, 'UTF-8'); ?>
                    </div>

                    <div class="page-url">
                        <?php echo htmlspecialchars($page['url'], ENT_QUOTES, 'UTF-8'); ?>
                    </div>

                </div>

                <div class="arrow">→</div>

            </a>

        <?php endforeach; ?>

    </div>

</div>

</body>
</html>
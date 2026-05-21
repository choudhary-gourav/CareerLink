$ErrorActionPreference = 'Stop'
Get-ChildItem -Path . -Recurse -Include *.java,*.js,*.jsx,*.css,*.html,*.properties -File | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path -Raw
    # Remove block comments /* ... */ (including multiline)
    $content = $content -replace '/\*[^*]*\*+(?:[^/*][^*]*\*+)*/', ''
    # Remove single-line // comments
    $content = $content -replace '(?m)//.*$', ''
    # Remove JSX comments {/* ... */}
    $content = $content -replace '\{\/\*.*?\*\/\}', ''
    # Remove CSS comments /* ... */ (already covered by block pattern)
    # Remove property file comments starting with #
    $content = $content -replace '(?m)^\s*#.*$', ''
    Set-Content -Path $path -Value $content -Force
}

$API_KEY = "b7662c4f807bfab908abc99e0459e5ca"
$MOVIES_FILE = "src/data/movies.ts"

# Read the file content
$content = Get-Content $MOVIES_FILE -Raw

# Extract the JSON part
$startMarker = "export const movies: Movie[] = "
$startIndex = $content.IndexOf($startMarker)
if ($startIndex -eq -1) {
    Write-Error "Could not find start of movies array"
    exit 1
}

$jsonStart = $startIndex + $startMarker.Length
$jsonEnd = $content.LastIndexOf("];") + 1
$jsonContent = $content.Substring($jsonStart, $jsonEnd - $jsonStart)

try {
    $movies = $jsonContent | ConvertFrom-Json
}
catch {
    Write-Error "Error parsing JSON: $_"
    exit 1
}

Write-Host "Found $($movies.Count) movies. Updating images..."

$updatedCount = 0
$batchSize = 5
$counter = 0

foreach ($movie in $movies) {
    # Skip if already updated
    if ($movie.image -match "tmdb.org") {
        continue
    }

    $found = $false
    
    # Try by IMDB ID first
    if ($movie.id -match "^tt") {
        $url = "https://api.themoviedb.org/3/find/$($movie.id)?api_key=$API_KEY&external_source=imdb_id"
        try {
            $response = Invoke-RestMethod -Uri $url -Method Get
            if ($response.movie_results.Count -gt 0 -and $response.movie_results[0].poster_path) {
                $posterPath = $response.movie_results[0].poster_path
                $movie.image = "https://image.tmdb.org/t/p/w500$posterPath"
                $updatedCount++
                $found = $true
                Write-Host -NoNewline "."
            }
        }
        catch {
            # Ignore error
        }
    }

    # Fallback: Search by Title + Year if ID failed
    if (-not $found) {
        $cleanTitle = $movie.title -replace " \d{4}$", ""
        $searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=$API_KEY&query=$([Uri]::EscapeDataString($cleanTitle))&year=$($movie.year)"
        try {
            $searchResponse = Invoke-RestMethod -Uri $searchUrl -Method Get
            if ($searchResponse.results.Count -gt 0 -and $searchResponse.results[0].poster_path) {
                $posterPath = $searchResponse.results[0].poster_path
                $movie.image = "https://image.tmdb.org/t/p/w500$posterPath"
                $updatedCount++
                Write-Host -NoNewline "+"
            }
            else {
                Write-Host -NoNewline "x"
            }
        }
        catch {
            Write-Host -NoNewline "E"
        }
    }
    
    # Rate limiting
    $counter++
    if ($counter % $batchSize -eq 0) {
        Start-Sleep -Milliseconds 200
    }

    # Save incrementally every 50 items
    if ($counter % 50 -eq 0) {
        $newJson = $movies | ConvertTo-Json -Depth 10
        $newContent = @"
export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  description: string;
}

export const movies: Movie[] = $newJson;
"@
        Set-Content -Path $MOVIES_FILE -Value $newContent
        Write-Host -NoNewline "[Saved]"
    }
}

Write-Host "`nUpdated $updatedCount images."

# Final Save
$newJson = $movies | ConvertTo-Json -Depth 10
$newContent = @"
export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  description: string;
}

export const movies: Movie[] = $newJson;
"@

Set-Content -Path $MOVIES_FILE -Value $newContent
Write-Host "Done!"

# Dabeiseinistalles ETL

Four azure functions performing ETL needed to provide the data used in https://dabeiseinistalles.netlify.com/rangliste/

## Azure Functions

### SixToJson

Given a date and an identifier whether to download the small/midcap or bluechip CSV from SIX, downloads the respective CSV and, converts it to JSON returns that JSON as response body.

### SixIntegrate

Takes a POST'ed JSON (usually the one produced by `SixToJson`) and integrates it into an Azure Blob Storage file (as of writing this: `pricesV2.json`), replacing prices of equal date/stock as the existing ones.

### SixMain

1. Calls `SixToJson` for both types of files (small/midcap and bluechips) for a date that is passed as a parameter.
2. For each of the two received JSONs, calls `SixIntegrate`

### SixTimer

Calls `SixMain` periodically.

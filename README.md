# OgBot

This is bot offers multiple random generators for FFG Star Wars.

# Run locally (Docker)

```bash
# If ogbot is already running
npm run docker

# If ogbot is not running
npm run docker-start
```

# How to use

All commands should start with `!og`.

For example `!og g base -name SomeCoolBase` could generate something similar to:

```yaml
name: SomeCoolBase
purpose:
    name: Data Vault
location:
    name: Underground / cave network
status:
    name: Commander is corrupt
initialSeed: 196704
```

You can replay the generated items by passing in the seed, like this: `!og g base -name SomeCoolBase -seed 196704`.

## Help

You can add `-h` to get help like `!og g -h` would output the help of the `generate` command. For the initial list of commands type `!og`.

# Commands

-   clean: delete messages, type `!og clean -h` for more info.
-   info: , type `!og info -h` for more info.
-   version: output the bot version
-   generate: generate random stuff, type `!og generate -h` for more info.

# Generators

These are the generators that exists:

-   `uglyspaceship`: type `!og g uglyspaceship -h` for more info.
-   `adventure`: type `!og g adventure -h` for more info.
-   `alignmentandattitude`: type `!og g alignmentandattitude -h` for more info.
-   `spacecraft`: type `!og g spacecraft -h` for more info.
-   `spacetraffic`: type `!og g spacetraffic -h` for more info.
-   `imperialmission`: type `!og g imperialmission -h` for more info.
-   `imperialbase`: type `!og g imperialbase -h` for more info.
-   `rebelbase`: type `!og g rebelbase -h` for more info.
-   `base`: type `!og g base -h` for more info.
-   `motivations`: type `!og g motivations -h` for more info.
-   `alienname`: type `!og g alienname -h` for more info.
-   `name`: type `!og g name -h` for more info.
-   `droidname`: type `!og g droidname -h` for more info.
-   `place`: type `!og g place -h` for more info.
-   `personality`: type `!og g personality -h` for more info.
-   `rank`: type `!og g rank -h` for more info.
-   `species`: type `!og g species -h` for more info.
-   `default`: type `!og g default -h` for more info. You must omit the `default` for this one, like `!og g -clan empire -corp navy`.

Most generators supports a `-count 10` option to generate more than one element (useful for names so you can pick the more interesting ones).

If you prefer JSON to YAML, you can add `-output JSON` to any command.

For example `!og g droidname -count 3` could output something like:

```YAML
values:
  - 7W-C
  - PM-79S
  - B0-75
initialSeed: 347645
```

And `!og g droidname -count 3 -output JSON` could output something like:

<!-- prettier-ignore -->
```json
{
  "values": [
    "W80-1",
    "EB-1N",
    "MD-332"
  ],
  "initialSeed": 19456
}
```

# Release notes

## 3.3.0

-   Add `!og g dwarfstrongholdname` and `!og g dwarfname` generators

## 3.2.2

-   Add a few evil personalities to the `!og g personality` data set

## 3.2.1

-   Add missing `gender` option to the name generator help.

## 3.2.0

-   Initial release on 2020-03-28, I'll start to keep track of changes from this point forward.

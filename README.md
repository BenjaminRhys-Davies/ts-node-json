# Brief

Provide the ability to load, question and report upon the contents of a large number of json files.

# Purpose

Project aims to demonstrate the principles of modern, asynchronous and extensible typescript development.

Logic retains the ability to be deployed / executed on server (herein exemplified using node) as well as to client.

# Overview

 * Extension parsers can be registered with parser service
 * Questions can be registered with the interrogation service
 * Report criterion can be registered with the correlation service
 * a ProgressBar is visualised to console
 * verbose diagnostics and performce information is logged to <diagnostics.log>
 * Report execution runs generate a <report.json>. Please see Usage - Report

## Pre-requisits

 * nodejs v10 or greater
 * docker (installable from https://store.docker.com/search?type=edition&offering=community)

# Setup

* `npm install`

# Test

* `npm test`
* `npm run test:coverage`

# Lint

* `npm run lint`

## Running

* `docker-compose -f "docker-compose.yml" up -d --build` (or "compose up" from IDE)
* `docker run --rm -ti ts-node-json_nodecli /bin/sh`

# Usage

# Parse a file
* `npm run start -- cat {{FilePath}}` - where {{FilePath}} is a path to a file (eg. './json/basic.json')

## Default (json) extension

Extension is defaulted to '.json' files and has been pre-configured within './src/setup/json.ts' - as per Configuration

## List files
* `npm run start -- ls {{FolderPath}}` - where {{FolderPath}} is a path to a folder
Eg. 'npm run start -- ls ./json'

## Query files
* `npm run start -- query {{FolderPath}}` - where {{FolderPath}} is a path to a folder
Eg. 'npm run start -- query ./json'

## Report file queries
* `npm run start -- report {{FolderPath}}` - where {{FolderPath}} is a path to a folder
Eg. 'npm run start -- report ./json'

## Constrain to a specific extension

Any non-JSON extension has to be pre-configured within './src/setup/{{extension}}.ts' (and imported into './src/main.ts') - please see './src/setup/json.ts' for reference

## List files
* `npm run start -- ls {{FolderPath}} {{extension}}` - where {{FolderPath}} is a path to a folder and {{extension}} is a file extension
Eg. 'npm run start -- ls ./json .json')

## Query files
* `npm run start -- query {{FolderPath}} {{extension}}` - where {{FolderPath}} is a path to a folder and {{extension}} is a file extension
Eg. 'npm run start -- query ./json .json')

## Report file queries
* `npm run start -- report {{FolderPath}} {{extension}}` - where {{FolderPath}} is a path to a folder and {{extension}} is a file extension
Eg. 'npm run start -- report ./json .json')

# Output

Report executions will generate <report.json> composing of an array of { name, data } report objects.

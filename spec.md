# Allo Starter Kit Specification

## Why Allo Starter Kit?

1. Reduce TTV for new builds. Provide devs with powerful tools and patterns to increase velocity.
2. The Allo Starter Kit aims to address the tradeoff between customization and scalability by enabling quick creation of fully customized Allo builds.
3. See [full spec](https://docs.google.com/document/d/1veQApbwHbSF7aXh59-tZXCW0u1oKgenK6S9I-zKWtis/edit#heading=h.k9kvtdrmgwim).

What do we want to build first?

1. UI on top of Allo protocol.
2. Good docs, easy to get to hello world in < 5 mins.
3. Easy to fork.
4. Maintain simplicity throughout the implementation process.

[Figma designs](https://www.figma.com/design/o3IXTUQDkkNyyjbAG5GBq5/Allo-UI-Kit?node-id=2348-6864&t=37sy6t6X5avMQd8a-0)

## Minimal Viable Components (MVC)

The initial public release (Milestone 1) will focus on delivering the simplest components that still bring value to developers. This enables an early release without significant commitments to early design decisions. Subsequent milestones will add more functionality, such as supporting additional strategies and enhancing round admin components.

## Personas

1. **Round Manager & Funder**: Wants to create rounds to reward projects in their ecosystem.
2. **Grantee**: Seeks financial support to continue work on their project.
3. **Supporter**: Wants to discover and support projects through voting or donations.

## Models

1. **Round**: Created by Round Managers and can be funded with tokens.
2. **Project**: Created by Grantees.
3. **Application**: Submitted by Grantees to a Round for their Project.

## Supported Strategies

### DirectGrants

A straightforward strategy that transfers tokens to a list of addresses and amounts.

## Features

### Create/Edit Round

**Persona: Round Manager**

A user can create a new round by filling out:

- Round name
- Round description in markdown
- List of round manager addresses
- Select list with strategies
- Round start and end times
- Application start and end times

### Approve Applications

**Persona: Round Manager**

A round admin can approve applications submitted to the round. This includes:

- A table of projects
- A badge indicating application status (pending, approved)

### Fund Round

**Persona: Round Manager & Funder**

A user (or only admins) can transfer tokens to the round contract by entering the amount.

### Distribute Round

**Persona: Round Manager**

A round admin can distribute tokens to projects. This includes:

- A table of approved projects
- Input fields for payout address and amount
- Exporting a CSV file pre-filled with all approved projects
- Importing a CSV to override the table data

### Create Applications

**Persona: Grantee**

A user can create applications based on:

- Round IDs
- Round addresses

### View Applications

**Persona: Grantee**

A user can view their submitted applications, displaying a list of submitted applications.

### Application Details

**Persona: ALL**

A user can view application details, which include:

- Project name
- Project description
- Project avatar
- Project banner

### Discover Rounds

**Persona: ALL**

A user can browse created rounds based on filters such as:

- Strategy addresses
- Round timestamps
- Networks

A grid of RoundCards will be rendered, showing:

- Round name
- Round description
- Round banner
- Round state indicator (round starts/ends in)
- Round network

### Round Details

**Persona: ALL**

A user can view round details, including:

- Round name
- Round description in markdown
- Round banner image
- Round meta information (timestamps, network)

### Discover Applications

**Persona: ALL**

A user can browse applications based on filters such as:

- Round IDs
- Strategy addresses

### Discover Projects

**Persona: ALL**

A user can find grants based on filters such as application IDs. A grid of grant projects will be rendered, showing:

- Project name
- Project description

### Project Details

**Persona: ALL**

A user can view project details, which include:

- Project name
- Project description in markdown
- Project banner image
- Project meta information (timestamps, network)

### Support Projects

**Persona: Supporter**

A user can find, add projects to their cart, and then fund and/or vote for them.

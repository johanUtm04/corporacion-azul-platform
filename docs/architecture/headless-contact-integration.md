# Headless Contact Form Integration — V1

## Overview

Contact submissions follow this workflow:

React → Laravel → WordPress Contact Bridge
→ Fluent Forms → FluentSMTP → Email

React integration is pending.

## Laravel Endpoint

POST /api/v1/contact

Responsibilities:
- Validate customer information.
- Require privacy consent.
- Restrict Mexican states and contact subjects.
- Apply rate limiting: 5 requests/minute per IP.
- Forward requests securely to WordPress.

## WordPress Integration

Endpoint:
POST /wp-json/ca/v1/contact

Plugin: ca-contact-bridge
Fluent Forms Form ID: 3

Responsibilities:
- Authenticate requests using a private Bearer token.
- Independently validate and sanitize input.
- Process submissions through Fluent Forms.
- Store entries and trigger email notifications.

## Configuration

Laravel environment variables:
- WP_CONTACT_BRIDGE_URL
- WP_CONTACT_BRIDGE_TOKEN

WordPress configuration:
- CAZ_CONTACT_BRIDGE_TOKEN

Never commit credentials.

## Responses

- 201: Submission accepted
- 422: Validation failed
- 429: Too many requests
- 502: WordPress service error
- 503: Connection or service unavailable

## Verification

- Manual end-to-end API submission succeeded.
- Authentication and validation checks passed.
- Laravel test suite: 34 tests, 121 assertions.

## Pending

- React contact form integration.
- Production HTTPS and SMTP configuration.
- Production security and deployment verification.

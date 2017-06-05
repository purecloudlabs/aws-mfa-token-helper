# Welcome!

If you're reading this, you probably don't have any idea how to set up your
AWS credentials. Fortunately, with the powers of computers, we're going to make this easy for you!

*"But wait,"* you say, *"doesn't `<x>` already do this?"*

Probably! Oh well!

## Assumptions
1. You can `npm install` stuff
2. You have AWS credentials for the env you need and you've set up an MFA device

## Ready? Go.

1. `npm install` - you've used node before, right?
2. Get your AWS credentials. You could technically do this first, if you wanted,
but this is an exercise in following directions, so pay attention.
    1. Log into the aws console
    2. Go to Security Credentials (under your account
        at the top right)
    3. Search your name
    4. Click your name
    5. Create an access key
    6. Copy the template creds file to your aws home -
    `cp credentials ~/.aws/credentials`
    7. Copy the access key id and secret access key into that file
    8. Copy the mfa file to your aws home -
    `cp mfa_id ~/.aws/mfa_id`
    8. Copy your MFA token into that file. You can find this in the "Assigned MFA device" field in the security credentials section of the AWS user page. (e.g. arn:aws:iam::<stuff>:mfa/<username>).
    9. Think, "wouldn't it have been easier to just
    `echo <mfa:device:id> ~/.aws/mfa_id`"
    10. Remember what I said about following directions and just do it
    11. npm start
    12. Enter your MFA token
    13. Check `~/.aws/credentials` to make sure you have a `[default]` section
    with credentials
    14. Send Matt Cheely and Xander Dumaine $5

F.A.Q

- **Q:** Why were there so many steps up there? Couldn't you have used sentences
and shortened it up?
  - **A:** Stop asking so many questions
- **Q:** Why is this README so snarky?
  - **A:** ¯\\\_(ツ)\_/¯

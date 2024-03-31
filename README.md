Feb 2
* Currently working on writing the first database user data
* Can write data in the database

Feb 4
* Log-in / reading data / passport JS from the database


Feb 5
* Next is passport authenticator for log-in
* implementing bcryptjs

* sanitization and validation of fields
    - debugged the error, still working on it (Feb 9)
    - hash problem with password solved (feb 12)

Mar 4
    - confirm password (finish number 3) -> done (March 11)

Mar 11
    - solving 4/10
    - ☑️prioritize natin yung functionality, oks lang kahit sabog sabog tignan at first

    - ☑️at sign-up, everyone has a standard membership
    - ☑️so if nag lagay ng passcode, automatically, elite na sila tama ba?

Mar 12
    - Are we gonna use Passport JS for verifying the passcode? Or not necessary, just use the express validator? (somehow confused abt these two)

Mar 18
-   
    - attempting to do the 4/10
    - working on 4/10, now elite page appearing but using method=GET

Mar 21
-   
    - using method=POST now for the passcode
    - You can now enter as elite member 'initial', still needs error catcher

Mar 29
*   
    - we need to deflect the error message from inputting the passcode for Elite ☑️
    - fixing the route names ☑️
    - used env file for the elite member passcode ☑️

Mar 30 - Mar 31
* Update membership status ☑️
    -   retrieving data from MongoDB
        - bug #1: i forgot to put .exec() during findById
        - bug #2: _id produces new Object, id produces the raw id value
        - bug #3: i forgot the 'await' keyword during the findById. **smh**
    - i used mongoDB's updateOne, doesnt need to .save() the file. it automatically changes.

Mar 31
* Now do the messages
    - standard membership read only
    - elite membership read and write
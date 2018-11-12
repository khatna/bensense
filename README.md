## bensense - realtime triple double information

This is a simple node script that notifies the user when a player of their choice completes a triple double<sup>*</sup> in a live NBA game by logging  a message the player's stats to the console.   

<sub>*A triple double is when a player has logged 10 or more in 3 of the 5 major statistical categories (points, assists, rebounds, steals and blocks).</sub>

## Usage
Run `npm install` to install the necessary packages, namely request and request-promise. 

Run `node app.js [player's first name] [player's last name]` (the name inputs are case insensitive)  

Today's date, whether the player was successfully found, the player's team, and the details their next game will be logged to the console. For example:

`node app.js Ben Simmons`

```
Ben Simmons successfully found
Ben Simmons Team: PHI
Ben Simmons's next game is on 20181101 against LAC
```

Then, if the player's next game is currently underway, the script will check if the player has completed a triple double every 6 seconds. If the player hasn't completed the triple double yet, his stats are just logged once a minute:  

```
No triple double yet
Ben Simmons statline:

                Points:     5
                Assists:    4
                Rebounds:   3
                Steals:     0
                Blocks:     0
```  

If the player does manage to complete a triple double, the full statline will be printed to the console:  

```
Ben Simmons has achieved a triple double!
Ben Simmons statline:

                Points:     14
                Assists:    10
                Rebounds:   13
                Steals:     1
                Blocks:     0
```  

and the script stops execution

## Future plans
In the future, I will modify the script such that instead logging to the console, the script will send SMS text messages to the user.

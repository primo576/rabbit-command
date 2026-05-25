               function randomColor(){
                       function getRandomInt(max) {
                        return Math.floor(Math.random() * max);
                        }
           c=[
             'red','yellow','orange','green'
           ]
           
           return c[getRandomInt(c.length)]
         }
exports.splitFunction = function splitter(myString){

    //console.log(myString);

    var i = 0;
    var x = 0;
    var equals = new Array(6);
    while(x<myString.length){
        if(myString.charAt(x)=="="){
            equals[i] = x;
            i++;
        }
        x++;
    }

    var and = new Array(5);
    i=0;x=0;
    while(x<myString.length){
        if(myString.charAt(x)=="&"){
            and[i]=x;
            //print(and[i]+"\n");
            i++;

        }
        x++;
    }

    var parsedarray = new Array(5); i=1;
    while(i<and.length){
        parsedarray[i-1] = myString.substring(equals[i]+1,and[i]);
        //print(parsedarray[i-1]+"\n");
        i++;
    }
    parsedarray[4] = myString.substring(equals[i]+1,myString.length);

    //console.log(parsedarray);
    return (parsedarray);
};


exports.decodeFunction = function decoder(myArray){
    var myString = "";
    myString += myArray[3];
    myString = myString.replace("%40", "@");

    myArray[3] = myString;
    return myArray;
};
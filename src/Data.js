export const API_KEY = 'AIzaSyDi9iWjmallEzEdViNnoYZMPYKUSD6ft3g';

export const valueConverter = (value)=>{

    if(value >= 1000000){
        return Math.floor(value/1000000) + 'M'
    }

    if(value >= 1000){
        return Math.floor(value/1000) + 'K'
    }
    
    else{
        return value
    }
}
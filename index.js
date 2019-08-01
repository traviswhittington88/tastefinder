
'use strict';

const herokuUrl = 'https://cors-anywhere.herokuapp.com/'
const youtubeApiKey = 'AIzaSyAIZy1A-yntbrNRZAh31hjzL7Xy5tzZ5z4';
const tasteDiveApiKey = '341376-TasteFin-9HSMVD5G';
const youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3/search';
const tasteDiveBaseUrl='https://tastedive.com/api/similar';


function displayTasteDiveResults(responseJson){
    console.log('This is my tasteDive json object',responseJson);
    $('#js-results-list1').empty();
    $('#js-results-list1').append(`<h2>RECOMMENDATION</h2><li><p>You might like 
     ${responseJson.Similar.Results[0].Name}</p><h3>Description</h2><p>${responseJson.Similar.Results[0].wTeaser}
     </p><p><a href="${responseJson.Similar.Results[0].wUrl}"><h3>Wiki</h3></a></p></li>`);
    $('#js-results1').removeClass('hidden');              
    
      

}

function displayYoutubeResults(responseJson){
    console.log('This is my youtube Api json object',responseJson);
    $('#js-results-list2').empty();
    $('#js-results-list2').append(`<h2>Video</h2>`);

    for (let i = 0; i < responseJson.items.length; i++){
    $('#js-results-list2').append(
        `<li><h3>${responseJson.items[i].snippet.title}</h3>
        <p>${responseJson.items[i].snippet.description}</p>
        <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
        </li>`)
    };

    $('#js-results2').removeClass('hidden');
}

function tasteDiveApiFetch(url,options){
    fetch(url,options)
    .then(response => {
        if(response.ok) {
        return response.json();
        
        }
        throw new Error(response.statusText);        
    })
    .then(responseJson => displayTasteDiveResults(responseJson))
    .catch(err => {
        $('#js-error').text(`Something went wrong: ${err.message}`);
    });
}


function youtubeApiFetch(url,options){
    fetch(url,options)
    .then(response => {
        if(response.ok) {
        return response.json();
        
        }
        throw new Error(response.statusText);        
    })
    .then(responseJson => displayYoutubeResults(responseJson))
    .catch(err => {
        $('#js-error').text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(obj){
    const queryString = Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    console.log(queryString);

    return queryString.join('&');
}


function getYoutubeResults(query, maxResults=3){

    const youtubeParams = {
        key: youtubeApiKey,
        q: query,
        part: 'snippet',
        maxResults,
        type: 'video'
    };

    const queryString = formatQueryParams(youtubeParams);
    const youtubeUrl = youtubeBaseUrl + '?' + queryString;
    console.log(youtubeUrl);

    youtubeApiFetch(youtubeUrl); 
}


function getTasteDiveResults(query,media){

    const tasteDiveparams = {
        q: query,
        type: media,
        limit: 1,
        info: 1,
        k: tasteDiveApiKey
    };
    const tasteDiveQueryString = formatQueryParams(tasteDiveparams);
    const tasteDiveUrl = herokuUrl + tasteDiveBaseUrl + '?' + tasteDiveQueryString;
    console.log(tasteDiveUrl);

    const tasteDiveOptions = {
        headers: new Headers({
                "x-requested-with": "xhr" 
            })
                              
    };

    tasteDiveApiFetch(tasteDiveUrl,tasteDiveOptions);

}


function watchForm(media){
    $("#js-form").submit(function(event){
        event.preventDefault();
        const searchTerm= $('#js-search-term').val();
        console.log(searchTerm);
        getTasteDiveResults(searchTerm,media);
        getYoutubeResults(searchTerm);
        
    })
}


function selectMedia(mediaType){
    
        console.log(mediaType,typeof(mediaType));

        if(mediaType ==='book'){
            $(".js-instruction").html(`Please enter the name of a favorite book`);
            $("#js-search-term").attr('placeholder','War and Peace');
        }
        else if(mediaType==='movie'){
            $(".js-instruction").html(`Please enter the name of a favorite movie`);
            $("#js-search-term").attr('placeholder','Pulp Fiction');
        }
        else{
            $(".js-instruction").html(`Please enter the name of a favorite band or artist`);
            $("#js-search-term").attr('placeholder','Pink Floyd');
        }
        watchForm(mediaType);
    }

    
function startApp(){
    $("#js-start").on('click','input[type="button"]',function(event){
        const medium= event.currentTarget.id
        $("#js-start").addClass('hidden');
        $(".container").removeClass('hidden');
        selectMedia(medium);
    })};


$(startApp);

let response;
let mediaType = 'NULL';
const herokuUrl = 'https://cors-anywhere.herokuapp.com/'
const youtubeApiKey = 'AIzaSyAIZy1A-yntbrNRZAh31hjzL7Xy5tzZ5z4';
const tasteDiveApiKey = '341376-TasteFin-9HSMVD5G';
const youtubeBaseUrl='https://www.googleapis.com/youtube/v3/search';
const tasteDiveBaseUrl='https://tastedive.com/api/similar';




function displayYoutubeResults(responseJson){
    console.log('This is my youtube Api json object',responseJson);
    $('#js-results-list2').empty();
    $('#js-results-list2').append(`<h2>Video</h2>`);

    for (let i = 0; i < responseJson.items.length; i++){
    $('#js-results-list2').append(
        `<li><h3>${responseJson.items[i].snippet.title}</h3>
        <p>${responseJson.items[i].snippet.description}</p><div class="videowrapper"><iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}?rel=0" frameborder="0" allowfullscreen></iframe></div>
        </li>`)
    };
/*<img src='${responseJson.items[i].snippet.thumbnails.default.url}'>*/
    $('#js-results2').removeClass('hidden');
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
        $('#js-error').removeClass('hidden').text(`Something went wrong: ${err.message}`);
    });
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

function displayTasteDiveResults(responseJson){
  console.log('display results ran');
    console.log('this is the tastedive object',responseJson);
    let recommendation = `${mediaType} ${responseJson.Similar.Results[0].Name}`;
    getYoutubeResults(recommendation);

    $('#js-results-list1').empty();

    if(responseJson.Similar.Results[0].Type ==='book'){
      $('#js-results-list1').append(`<li><h2>RECOMMENDATION</h2><p>If you like ${responseJson.Similar.Info[0].Name}...</p><p>You might like the book ${responseJson.Similar.Results[0].Name}.</p><h3>Description</h2><p>${responseJson.Similar.Results[0].wTeaser}</p><p><a href="${responseJson.Similar.Results[0].wUrl}"><h3>Wiki</h3></a></p></li>`);
    $('#js-results1').removeClass('hidden');              
    }

    else if(responseJson.Similar.Results[0].Type ==='author'){
      $('#js-results-list1').append(`<li><h2>RECOMMENDATION</h2><p>If you like ${responseJson.Similar.Info[0].Name}...</p><p>You might like the author ${responseJson.Similar.Results[0].Name}.</p><h3>Description</h2><p>${responseJson.Similar.Results[0].wTeaser}</p><p><a href="${responseJson.Similar.Results[0].wUrl}"><h3>Wiki</h3></a></p></li>`);
    $('#js-results1').removeClass('hidden');              
    }

    else if(responseJson.Similar.Results[0].Type ==='music'){
      $('#js-results-list1').append(`<li><h2>RECOMMENDATION</h2><p>If you like ${responseJson.Similar.Info[0].Name}...</p><p>You might like the music of ${responseJson.Similar.Results[0].Name}.</p><h3>Description</h2><p>${responseJson.Similar.Results[0].wTeaser}</p><p><a href="${responseJson.Similar.Results[0].wUrl}"><h3>Wiki</h3></a></p></li>`);
    $('#js-results1').removeClass('hidden');              
    }

    else{
    $('#js-results-list1').append(`<li><h2>RECOMMENDATION</h2><p>If you like ${responseJson.Similar.Info[0].Name}...</p><p>You might like the movie ${responseJson.Similar.Results[0].Name}</p><h3>Description</h3><p>${responseJson.Similar.Results[0].wTeaser}
     </p><p><a href="${responseJson.Similar.Results[0].wUrl}"><h3>Wiki</h3></a></p></li>`);
    $('#js-results1').removeClass('hidden');              
    }
}

function tasteDiveApiFetch(url,options){
  console.log('fetch ran');
    fetch(url,options)
    .then(response => {
        if(response.ok) {
        return response.json();
        
        }
        throw new Error(response.statusText);        
    })
    .then(responseJson => displayTasteDiveResults(responseJson))
    .catch(err => {
        $('#js-error').removeClass('hidden')
           if(`${err.message} === Cannot read property 'Name' of undefined`){
            $('#js-error').text(`That input doesn't exist. Please try again!`);}
           else{(`Something went wrong: ${err.message}`);}
    });
}

function formatQueryParams(obj){
    const queryString = Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    console.log(queryString);

    return queryString.join('&');
}

function getTasteDiveResults(query,media){
    console.log(media);
    const tasteDiveparams = {
        q: query,
        type: media,
        limit: 1,
        info: 1,
        k: tasteDiveApiKey
    };
    const tasteDiveQueryString = formatQueryParams(tasteDiveparams);
    const tasteDiveUrl = herokuUrl + tasteDiveBaseUrl + '?' + tasteDiveQueryString;
    console.log('this is the tastedive URL',tasteDiveUrl);

    const tasteDiveOptions = {
        headers: new Headers({
                "x-requested-with": "xhr" 
            })
                              
    };

      tasteDiveApiFetch(tasteDiveUrl,tasteDiveOptions);

}


function watchForm(){
    console.log(`loading watchForm`);
    $("#js-form").submit(function(event){
        event.preventDefault();
        $('#js-error').addClass('hidden');
        const searchTerm= $('#js-search-term').val();
        console.log(searchTerm);
        console.log(mediaType);
        getTasteDiveResults(searchTerm,mediaType);
    })
}


function setPlaceholder(mediaType){

        if(mediaType ==='books'){
            $("#js-search-term").attr('placeholder', 'Enter A Favorite Book');
        }
        else if(mediaType==="NULL"){
           $("#js-search-term").attr('placeholder', 'Enter a book, author, movie or band to get started!');
        }
        else if(mediaType ==='authors'){
            $('#js-search-term').attr('placeholder','How bout your favorite author?');
        }
        else if(mediaType==='movies'){
            $("#js-search-term").attr('placeholder',"e.g.'Pulp Fiction'");
        }
        else{
            $("#js-search-term").attr('placeholder','Pink Floyd');
        }
}


function getMediaType(){
  console.log(`loading getMediaType`);
  $("#js-start").on('click','input[type="button"]',function(event){
        /*let selectorString = `#${mediaType}`
        console.log(selectorString);
        $(selectorString).css({backgroundColor:'grey'});
        $(event.currentTarget).css({backgroundColor:'yellow'});*/
        $(event.currentTarget).toggleClass("select");
        $('.js-tab').not(event.currentTarget).removeClass('select').addClass('unselect');
       /* $(".js-tab").not(event.CurrentTarget).toggleClass("unselect");*/
        mediaType= event.currentTarget.id;
        setPlaceholder(mediaType);
  })
}

  function startApp(){
    getMediaType();
    watchForm();
  }
   

  
  



$(startApp);

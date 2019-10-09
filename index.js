
let mediaType = 'NULL';
const herokuUrl = 'https://cors-anywhere.herokuapp.com/'
const youtubeApiKey = 'AIzaSyC92Yc2MSvPnEN6stQHxhSzIWB8QqIsv5o';
const tasteDiveApiKey = '341376-TasteFin-9HSMVD5G';
const youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3/search';
const tasteDiveBaseUrl = 'https://tastedive.com/api/similar';

function displayYoutubeResults(responseJson) {
  complete();
  
  $('.js-results-list2').empty();
  $('.js-results-list2').append(`<h2>Video</h2>`);

  for (let i = 0; i < responseJson.items.length; i++) {
    $('.js-results-list2').append(
      `<li><h3 class='vidTitle'>${ responseJson.items[i].snippet.title }</h3>
       <div class="videowrapper">
       <iframe src="https://www.youtube.com/embed/${ responseJson.items[i].id.videoId }?rel=0" 
       frameborder="0" allowfullscreen></iframe></div>
       </li>`)
    };

  $('.js-results2').removeClass('hidden');
  $('.scrollWrapper').removeClass('hidden');
}

function youtubeApiFetch(url, options) {
  fetch(url, options)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      complete();
      throw new Error(response.statusText);        
    })
    .then(responseJson => displayYoutubeResults(responseJson))
    .catch(err => { 
        complete();
        $('#js-error').removeClass('hidden').text(`Something went wrong: ${ err.message }`);
    });
}

function getYoutubeResults(query, maxResults=3) {
  const youtubeParams = {
    key: youtubeApiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
    
  const queryString = formatQueryParams(youtubeParams);
  const youtubeUrl = youtubeBaseUrl + '?' + queryString;

  youtubeApiFetch(youtubeUrl); 
}

function displayTasteDiveResults(responseJson) {
  let recommendation = `${ mediaType } ${ responseJson.Similar.Results[0].Name }`;
  getYoutubeResults(recommendation);
    
  $('.js-results-list1').empty();

  if (responseJson.Similar.Results[0].Type === 'book') {
    $('.js-results-list1').append(`<li><h1>RECOMMENDATION</h1><p>If you like ${ responseJson.Similar.Info[0].Name }...
     </p><p>You might like the book ${ responseJson.Similar.Results[0].Name }.</p><h1>DESCRIPTION</h1>
     <p>${ responseJson.Similar.Results[0].wTeaser }</p><p><a href="${ responseJson.Similar.Results[0].wUrl }" class='wikiLink' target="_blank" alt="wiki link">
     <h2 class='wiki'>WIKI</h2></a></p></li>`);
    $('.js-results1').removeClass('hidden');              
  }

  else if (responseJson.Similar.Results[0].Type === 'author') {
    $('.js-results-list1').append(`<li><h1>RECOMMENDATION</h1><p>If you like ${ responseJson.Similar.Info[0].Name }...</p>
     <p>You might like the author ${ responseJson.Similar.Results[0].Name }.</p><h1>DESCRIPTION</h1>
     <p>${ responseJson.Similar.Results[0].wTeaser }</p><p><a href="${ responseJson.Similar.Results[0].wUrl }" class='wikiLink' target="_blank" alt="wiki link">
     <h2 class='wiki'>WIKI</h2></a></p></li>`);
    $('.js-results1').removeClass('hidden');              
  }

  else if (responseJson.Similar.Results[0].Type === 'music') {
    $('.js-results-list1').append(`<li><h1>RECOMMENDATION</h1><p>If you like ${ responseJson.Similar.Info[0].Name }...</p>
     <p>You might like the music of ${ responseJson.Similar.Results[0].Name }.</p><h1>DESCRIPTION</h1>
     <p>${ responseJson.Similar.Results[0].wTeaser }</p><p><a href="${ responseJson.Similar.Results[0].wUrl }" class='wikiLink' target="_blank" alt="wiki link">
     <h2 class='wiki'>WIKI</h2></a></p></li>`);
    $('.js-results1').removeClass('hidden');              
  }

  else {
    $('.js-results-list1').append(`<li><h1>RECOMMENDATION</h1><p>If you like ${ responseJson.Similar.Info[0].Name }...</p>
     <p>You might like the movie ${ responseJson.Similar.Results[0].Name }</p><h1>DESCRIPTION</h1>
     <p>${ responseJson.Similar.Results[0].wTeaser }</p><p><a href="${ responseJson.Similar.Results[0].wUrl }" class='wikiLink' target="_blank" alt="wiki link">
     <h2 class='wiki'>WIKI</h2></a></p></li>`);
    $('.js-results1').removeClass('hidden');              
  }
}

function tasteDiveApiFetch(url, options) {
  
  load();
    
  fetch(url, options)
    .then (response => {
      if (response.ok) {
        return response.json(); 
      }
      complete();
      throw new Error;
    })
    .then (responseJson => displayTasteDiveResults(responseJson))
    .catch (err => {
      let errMsg = err.message
      if(errMsg.includes("of undefined")) {
        $('.js-error').removeClass('hidden').text(`Oops, that input doesn't exist, check your spelling and try agagin!`); complete(); 
               $('.js-results1, .js-results2, .scrollWrapper').addClass('hidden');}
      else {
        $('.js-error').removeClass('hidden').text(`Something went wrong: ${ err.message }`); complete(); 
               $('.js-results1, .js-results2, .scrollWrapper').addClass('hidden');
      }
    })
}

function formatQueryParams(obj) {
  const queryString = Object.keys(obj).map(key => `${ encodeURIComponent(key) }=${ encodeURIComponent(obj[key]) }`);
  return queryString.join('&');
}

function getTasteDiveResults(query, media) {

  const tasteDiveparams = {
    q: query,
    type: media,
    limit: 1,
    info: 1,
    k: tasteDiveApiKey
  };
    
  const tasteDiveQueryString = formatQueryParams(tasteDiveparams);
  const tasteDiveUrl = herokuUrl + tasteDiveBaseUrl + '?' + tasteDiveQueryString; 
  
  const tasteDiveOptions = {
    headers: new Headers({
      "x-requested-with": "xhr" 
    })                        
  };
    
  tasteDiveApiFetch(tasteDiveUrl, tasteDiveOptions);
}

function watchForm() {
  
  $("#js-form").submit(function(event) {
    event.preventDefault();
      
    $('.js-error').addClass('hidden');
    const searchTerm = $('#js-search-term').val();
    $('#js-search-term').click(function(event) {
    $("form").trigger("reset");
   })  
    getTasteDiveResults(searchTerm, mediaType);
    })
}

function setPlaceholder(mediaType) {
  if (mediaType === 'books') {
    $("#js-search-term").attr('placeholder', 'Enter A Favorite Book');
  }
  else if (mediaType === "NULL") {
    $("#js-search-term").attr('placeholder', 'Book/Author/Movie/Music');
  }
  else if (mediaType === 'authors') {
    $('#js-search-term').attr('placeholder','Your favorite author?');
  }
  else if (mediaType ==='movies') {
    $("#js-search-term").attr('placeholder',"Pulp Fiction");
  }
  else {
    $("#js-search-term").attr('placeholder','Pink Floyd');
  }
}

function getMediaType() {
  $(".js-start").on('click', 'input[type="button"]', function(event) {
        $(event.currentTarget).toggleClass("select");
        $('.js-tab').not(event.currentTarget).removeClass('select').addClass('unselect');
        mediaType = event.currentTarget.id;
        setPlaceholder(mediaType);
  })
}

function load() {
  const loader = $('.loader');
  loader.css('opacity', '1');
  loader.removeClass('hidden');
}

function complete() {
  const loader = $('.loader');
  loader.css('opacity', '0')
  loader.addClass('hidden');
}

function scroll() {
  $('.scrollWrapper').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 1000);
  })
}

function startApp() {
  scroll();
  getMediaType();
  watchForm();
}

$(startApp);

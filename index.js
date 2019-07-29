
const tasteDive_api_key = '341376-TasteFin-9HSMVD5G';
const tasteDiveBase_url='https://tastedive.com/api/similar';

function ApiFetch(url,options){
    fetch(url,options)
    .then(response => {if(response.ok){
        return response.json();
    }
        throw new Error(`${response.statusText}`);        
})
    .then(responseJson => displayResults(responseJson))
    .catch(err => {$('#js-error').text(`Something went wrong: ${err.message}`)});
}

function formatQueryParams(obj){
    queryString = Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    console.log(queryString);

    return queryString.join('&');
}

function getResults(query,media){
    const params = {
        q: query,
        type: media,
        limit: 1,
        info: 1,
        k: tasteDive_api_key
    };
    const tasteDiveQueryString = formatQueryParams(params);
    const tasteDiveUrl = tasteDiveBase_url + '?' + tasteDiveQueryString;
    console.log(tasteDiveUrl);

    const options = {
        headers: new Headers({
            "Access-Control-Allow-Origin": '*',
            "mode": 'cors'
            })
                              
    };

    const tasteDiveJsonObject = ApiFetch(tasteDiveUrl,options);
    console.log(tasteDiveJsonObject);

}

function watchForm(media){
    $("#js-form").submit(function(event){
        event.preventDefault();
        const searchTerm= $('#js-search-term').val();
        console.log(searchTerm);
        getResults(searchTerm,media);
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
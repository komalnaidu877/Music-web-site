// 1. Generate all sections using Data and js
// 2. Add event listeners to play Audio
// 3. Audio Navber
// 4. Scroll state
// 5. Queue

// constants
const musicLibsContainer = document.getElementById('music-libs');
const audioPlayer = document.getElementById('audio_player');
const pausedBtn = document.getElementById('paused');
const playingBtn = document.getElementById('playing');
const songCurrentTime = document.getElementById('songTimeStart');
const songTotalTime = document.getElementById('songTotalTime');


var currentSongObj={};
var defaultImage="assests/images/defaultImage.gif";


// core App Logic
window.addEventListener('load',bootUpApp);

function bootUpApp(){
    fetchAndRenderAllSections();
}

function fetchAndRenderAllSections(){
    //fetch all section
    fetch('/assests/js/ganna.json')
    .then(res=>res.json())
    .then(res=>{
        console.table('responser',res);
        const {cardbox} = res;
        if(Array.isArray(cardbox) && cardbox.length){
            cardbox.forEach(section => {
                const {songsbox, songscards} =section;
                renderSection(songsbox, songscards);
            })
           
        }
       
    })
    .catch((err)=>{
        console.error(err);
        alert('error failing data');

    })
}
function renderSection(title, songsList){
   const songSection = makeSectionDom(title, songsList);
   musicLibsContainer.appendChild(songSection);
}

function makeSectionDom(title, songsList){
   const sectionDiv = document.createElement('div');
   sectionDiv.className= 'songs-sections';
   //add songs html
  sectionDiv.innerHTML=`
         <h2 class="section-heading">${title}</h2>
             <div class="songs-cont">
               ${songsList.map(songObj=>buildSongCardDom(songObj)).join('')}
       </div>
   `
       console.log(sectionDiv);
       return sectionDiv;
}
function buildSongCardDom(songObj){
    return `<div class="song-card" onclick="playSong(this)" data-songobj='${JSON.stringify(songObj)}'>
                <div class="img-cont">
                 <img src="${songObj.image_source}" alt="${songObj.song_name}">
                 <div class="overlay">  </div>
            </div>
                <p class="song-name">${songObj.song_name}</p>
       </div>
    `
}
//Music player function 
function playSong(songCardEl){
    const songObj = JSON.parse(songCardEl.dataset.songobj);
    console.log(songObj);
    setAndPlayCurrentSong(songObj);

    document.getElementById('music-player').classList.remove('hidden');

}
function setAndPlayCurrentSong(songObj){
    currentSongObj = songObj;
    audioPlayer.pause();
    audioPlayer.src = songObj.quality.low;
    audioPlayer.currentTime = 0;
    audioPlayer.play();

    updatePlayerUi(songObj);
}
function updatePlayerUi(songObj){
     const songImg = document.getElementById('song-img');
     const songName = document.getElementById('song-name');

     
     songImg.src = songObj.image_source;
     songName.innerHTML = songObj.song_name;

     songCurrentTime.innerHTML = audioPlayer.currentTime;
    

      pausedBtn.style.display = 'none';
      playingBtn.style.display = 'block';
    }

    function togglePlayer(){
       if(audioPlayer.paused) {
          audioPlayer.play();
       }
       else {
         audioPlayer.pause();
       }
       
       pausedBtn.style.display = audioPlayer.paused ? 'block' : 'none';
       playingBtn.style.display = audioPlayer.paused ? 'none' : 'block';
    }
    function updatePlayerTime(){
        if (!audioPlayer || audioPlayer.paused) return;

        const songCurrentTime = document.getElementById('songTimeStart');
        songCurrentTime.innerHtml = getTimeString(audioPlayer.currentTime);

        songTotalTime.innerHTML = getTimeString(audioPlayer.duration);
    }
   

    function getTimeString(time){
        return isNaN(audioPlayer.duration)?"0:00":Math.floor(time/60)+":"+parseInt((((time/60)%1)*100).toPrecision(2));
   }



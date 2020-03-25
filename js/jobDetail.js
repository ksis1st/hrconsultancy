
// auth.onAuthStateChanged(user => {
//     if (user) {

// db.collection('UserProfile').where("uid", "==", `${user.uid}`).get().then(doc => {

var search = location.search.substring(1);
var s = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')

var jobHead = document.getElementById('jobHeader');
var jobTitle = document.getElementById('jobDetails');
console.log(s);

db.collection('job').doc(s.jid).get().then(snapshot => {
    jobDet = snapshot.data();
    jobHead.innerHTML = `<h4 class="font-weight-bolder">${jobDet.title}</h4>`;

    jobTitle.innerHTML = `   <div class="col-12 mt-4 mb-2"> <b>Qualification :</b> ${jobDet.qualification}</div>
                            <div class="col-12 m-2">

                            <b>Experience:</b> ${jobDet.experience}
                            </div>
                            <div class="col-12 m-2">

                                <b>Job Location: </b>${jobDet.address}</div>

                            <div class="col-12 my-4">
                                <p class="mb-2"><b >Job Responsiblity</b></p>
                                <p>
                                ${jobDet.responsiblity}

                                </p>

                            </div>
                            <button type="button" class="btn btn-info btn-lg"  data-toggle="modal" data-target="#myModal"  >Apply for this job</button>
                            `
})







var cvUpload = document.getElementById('cvUpload');

    document.getElementById('Resume').addEventListener('change', e => {
        document.getElementById('ResumeLabel').innerHTML = e.target.files[0].name;

})

    cvUpload.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('cvButton').disabled = true;
        var name = cvUpload["name"].value;
        var email = cvUpload["email"].value;
        var phone = cvUpload["phone"].value;
        var Resume = cvUpload["aResume"].files[0];

        var filename = document.querySelector('#Resume').value;
        var extension = filename.split('.').pop();

        if(extension == '.mp3' || extension == '.aac' || extension == '.wmv' || extension == '.ooc' )
            Resume = 'Audio-CV/' + Date.now().toString() + email;
        else if (extension == '.mkv' || extension == '.mp4' || extension == '.mpeg' )
            Resume = 'Audio-CV/' + Date.now().toString() + email;
        else
            console.log('Not Supported');
        
        console.log(Resume);

    var audioStorageRef = firebase.storage().ref(audioResume);
    var task1 = audioStorageRef.put(AResume);
    
    document.getElementById('audioProgressBar').classList.remove('d-none');
    document.getElementById('audioInput').classList.add('d-none');
    let AProgressBar = document.getElementById('AprogressBar');
    task1.on('state_changed', function (snapshot) {

        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        AProgressBar.style.width = `${progress}%`
        AProgressBar.setAttribute("aria-valuenow", `${progress}`);
        console.log('Upload is ' + progress + '% done');

    }, function (error) {
        console.log("Error Uploading Audio");
    }, function () {

        let videoStorageRef = firebase.storage().ref(videoResume)
        let task2 = videoStorageRef.put(VResume)
        document.getElementById('videoProgressBar').classList.remove('d-none');
        document.getElementById('videoInput').classList.add('d-none');
        let VProgressBar = document.getElementById('vprogressBar');

        task2.on('state_changed', function (snapshot) {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            VProgressBar.style.width = `${progress}%`
            VProgressBar.setAttribute("aria-valuenow", `${progress}`);
            console.log('Upload is ' + progress + '% done');

        }, function (error) {
            console.log("Error Uploading Video");
        }, function () {
            db.collection('CV').add({
                name: name,
                email: email,
                jid: s.jid,
                phoneNo: phone,
                audioResume: audioResume,
                videoResume: videoResume
            }).then(ref => {
                cvUpload.reset();
                window.location.assign('../index.html')
            }).catch(err => console.log(JSON.stringify(err)));


        });
    });



})





// })
//     }
//     else {
//         console.log("not loggedin");
//         window.location.assign('./login.html');
//     }
// })

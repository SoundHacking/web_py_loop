/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const audio2 = document.querySelector('audio#audio2');
const callButton = document.querySelector('button#callButton');
const hangupButton = document.querySelector('button#hangupButton');
hangupButton.disabled = true;
callButton.onclick = call;
hangupButton.onclick = hangup;

let pc1;
let pc2;
let localStream;

let lastResult;

function onIceCandidate(pc, event) {
  console.log("onIceCandidate() >>>> ")
  const other_pc = (pc === pc1) ? pc2 : pc1;
  other_pc.addIceCandidate(event.candidate)
      .then(
          () => onAddIceCandidateSuccess(pc),
          err => onAddIceCandidateError(pc, err)
      );
  const pc_name = (pc === pc1) ? 'pc1' : 'pc2';
  console.log(`${pc_name} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
  console.log('onAddIceCandidateSuccess() >>>> AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log(`onAddIceCandidateError() >>>> Failed to add ICE Candidate: ${error.toString()}`);
}

function call() {
  callButton.disabled = true;
  console.log('--------------------------------------------------------------------------------');
  console.log('call() >>>> Starting call');
  const servers = null;
  pc1 = new RTCPeerConnection(servers);
  console.log('Created local peer connection object pc1');
  pc1.onicecandidate = e => onIceCandidate(pc1, e);
  pc2 = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object pc2');
  pc2.onicecandidate = e => onIceCandidate(pc2, e);
  pc2.ontrack = gotRemoteStream;
  console.log('Requesting local stream');
  navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(gotStream)
      .catch(e => {
        alert(`getUserMedia() error: ${e.name}`);
      });
}

function gotStream(stream) {
  hangupButton.disabled = false;
  console.log('gotStream() >>>> Received local stream');
  localStream = stream;
  const audioTracks = localStream.getAudioTracks();
  if (audioTracks.length > 0) {
    console.log(`Using Audio device: ${audioTracks[0].label}`);
  }
  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
  console.log('Adding Local Stream to peer connection');

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 0,
    voiceActivityDetection: false
  };
  pc1.createOffer(offerOptions)
      .then(gotDescription1, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
  console.log(`onCreateSessionDescriptionError() >>>> Failed to create session description: ${error.toString()}`);
}

function gotDescription1(desc) {
  console.log(`gotDescription1() >>>> Offer from pc1\n : {desc.sdp}`);
  pc1.setLocalDescription(desc)
      .then(() => {
        pc2.setRemoteDescription(desc).then(() => {
          return pc2.createAnswer().then(gotDescription2, onCreateSessionDescriptionError);
        }, onSetSessionDescriptionError);
      }, onSetSessionDescriptionError);
}

function gotDescription2(desc) {
  console.log(`gotDescription2() >>>> Answer from pc2\n : {desc.sdp}`);
  pc2.setLocalDescription(desc).then(() => {
    const useDtx = false;
    if (useDtx) {
      desc.sdp = desc.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
    }
    const useFec = true;
    if (!useFec) {
      desc.sdp = desc.sdp.replace('useinbandfec=1', 'useinbandfec=0');
    }
    pc1.setRemoteDescription(desc).then(() => {}, onSetSessionDescriptionError);
  }, onSetSessionDescriptionError);
}

function gotRemoteStream(e) {
  console.log("gotRemoteStream() >>>> ")
  if (audio2.srcObject !== e.streams[0]) {
    audio2.srcObject = e.streams[0];
    console.log('Received remote stream');
  }
}

function onSetSessionDescriptionError(error) {
  console.log(`onSetSessionDescriptionError() >>>> Failed to set session description: ${error.toString()}`);
}

function hangup() {
  console.log('--------------------------------------------------------------------------------');
  console.log('hangup() >>>> Ending call');
  localStream.getTracks().forEach(track => track.stop());
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}


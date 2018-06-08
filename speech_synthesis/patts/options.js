// Copyright 2018 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/** @constructor */
var OptionsPage = function() {
  window.addEventListener('message', this.onMessage_.bind(this));
  this.sendToBackground_({
    type: 'getVoices'
  });
};

/**
 * @param {Object} message
 * @private
 */
OptionsPage.prototype.onMessage_ = function(message) {
  var command = JSON.parse(message.data);
  if (command.type == 'updateVoices') {
    this.updateVoices_(command.data);
  }
};

/**
 * @param {Object} message
 * @private
 */
OptionsPage.prototype.sendToBackground_ = function(message) {
  var views = chrome.extension.getViews();
  for (var i = 0; i < views.length; i++) {
    if (views[i].location.href.indexOf('generated_background_page.html') > 0) {
      views[i].postMessage(JSON.stringify(message), window.location.origin);
    }
  }
};

/**
 * @param {Array} voices
 * @private
 */
OptionsPage.prototype.updateVoices_ = function(voices) {
  var voiceContainer = document.getElementById('voiceContainer');
  voiceContainer.innerHTML = '';

  var voiceList = document.createElement('ul');
  voiceContainer.appendChild(voiceList);
  voices.forEach((voice) => {
    var voiceItem = document.createElement('li');
    voiceList.appendChild(voiceItem);
    voiceItem.className = 'option';

    var voiceText = document.createElement('span');
    voiceItem.appendChild(voiceText);
    voiceText.id = voice.pipelineFile;
    voiceText.textContent = voice.voiceName;

    var actionButton = document.createElement('button');
    voiceItem.appendChild(actionButton);
    // TODO: get i18n working.
    actionButton.textContent = voice.cacheToDisk ?
        (voice.unloaded ? 'Install' : 'Uninstall') : 'Built in';
    actionButton.setAttribute('aria-describedby', voiceText.id);
    actionButton.disabled = !voice.cacheToDisk;
    actionButton.addEventListener('click', (evt) => {
      actionButton.disabled = true;
      this.sendToBackground_({
        type: voice.unloaded ? 'addVoice' : 'removeVoice',
        data: voice
      });
    });
  });
};

new OptionsPage();

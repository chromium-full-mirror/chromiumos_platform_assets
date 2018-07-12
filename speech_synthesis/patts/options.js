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
  voices.sort((v1, v2) => {
    return v1.displayName.localeCompare(v2.displayName);
  });

  var voiceContainer = document.getElementById('voiceContainer');
  voiceContainer.innerHTML = '';

  var voiceList = document.createElement('ul');
  voiceContainer.appendChild(voiceList);
  voices.forEach((voice) => {
    var voiceItem = document.createElement('li');
    voiceList.appendChild(voiceItem);
    voiceItem.className = 'option';

    var aboutVoice = document.createElement('div');
    voiceItem.appendChild(aboutVoice);
    aboutVoice.className = 'about';

    var voiceText = document.createElement('div');
    aboutVoice.appendChild(voiceText);
    voiceText.id = voice.pipelineFile;
    voiceText.textContent = voice.voiceName;
    voiceText.className = 'name';

    var voiceDescription = null;
    if (voice.displayName) {
      voiceDescription = document.createElement('div');
      aboutVoice.appendChild(voiceDescription);
      voiceDescription.id = 'desc-' + voice.pipelineFile;
      voiceDescription.textContent = voice.displayName;
      voiceDescription.className = 'description';
    }

    // Override the DOM ordering only for accessibility by using aria-owns.
    var ariaOwnsValue = [];
    if (voiceDescription)
    ariaOwnsValue.push(voiceDescription.id);
    ariaOwnsValue.push(voiceText.id);
    aboutVoice.setAttribute('aria-owns', ariaOwnsValue.join(' '));

    var actionButton = document.createElement('button');
    voiceItem.appendChild(actionButton);
    // TODO: get i18n working.
    actionButton.textContent = voice.cacheToDisk ?
        (voice.unloaded ? 'Install' : 'Uninstall') : 'Built in';
    actionButton.setAttribute('aria-describedby',
        voiceDescription ? voiceDescription.id : voiceText.id);
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

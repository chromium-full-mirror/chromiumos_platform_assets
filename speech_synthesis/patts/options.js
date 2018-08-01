// Copyright 2018 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/** @constructor */
var OptionsPage = function() {
  window.addEventListener('message', this.onMessage_.bind(this));
  document.getElementById('searchInput')
      .addEventListener('input', this.searchChanged_.bind(this));
  document.getElementById('clearButton')
      .addEventListener('click', this.clearSearch_.bind(this));
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
  this.voices_ = voices;
  this.voices_.sort((v1, v2) => {
    return v1.displayName.localeCompare(v2.displayName);
  });

  var voiceContainer = document.getElementById('voiceContainer');
  voiceContainer.innerHTML = '';

  this.voiceList_ = document.createElement('ul');
  voiceContainer.appendChild(this.voiceList_);
  this.voices_.forEach((voice) => {
    voice.voiceItem = document.createElement('li');
    this.voiceList_.appendChild(voice.voiceItem);
    voice.voiceItem.className = 'option';
    voice.voiceItem.id = 'li-' + voice.pipelineFile;

    var aboutVoice = document.createElement('div');
    voice.voiceItem.appendChild(aboutVoice);
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
    if (voiceDescription) ariaOwnsValue.push(voiceDescription.id);
    ariaOwnsValue.push(voiceText.id);
    aboutVoice.setAttribute('aria-owns', ariaOwnsValue.join(' '));

    var actionButton = document.createElement('button');
    voice.voiceItem.appendChild(actionButton);
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
  // Apply the search.
  this.searchChanged_();
};

/**
 * Called when the button to clear the search box is clicked.
 * @private
 */
OptionsPage.prototype.clearSearch_ = function() {
  let searchInput = document.getElementById('searchInput');
  searchInput.value = '';
  this.searchChanged_();
  searchInput.focus();
};

/**
 * Called when the search box contents change.
 * @private
 */
OptionsPage.prototype.searchChanged_ = function() {
  if (!this.voiceList_) return;
  let errorMessage = document.getElementById('errorMessage');
  let clearButton = document.getElementById('clearButton');
  let searchInput = document.getElementById('searchInput').value.trim();
  let searchInputLower = searchInput.toLowerCase();
  let topResult = '';
  let resultCount = 0;
  this.voices_.forEach((voice) => {
    let element = document.getElementById('li-' + voice.pipelineFile);
    if (searchInput === '' ||
        (voice.voiceName.toLowerCase().search(searchInputLower) >= 0 ||
         voice.displayName.toLowerCase().search(searchInputLower) >= 0)) {
      if (topResult === '') topResult = voice.displayName;
      element.style['display'] = '';
      resultCount += 1;
    } else {
      element.style['display'] = 'none';
    }
  });
  clearButton.style['display'] = searchInput === '' ? 'none' : '';
  if (resultCount === 0) {
    errorMessage.innerText = 'No search results found';
    errorMessage.style['display'] = '';
  } else {
    errorMessage.innerText = '';
    errorMessage.style['display'] = 'none';
  }
  // Update the live region with a delay to report the results.
  // Clear a previous timeout so we don't do too many duplicate announcements.
  clearTimeout(this.searchSummaryUpdate_);
  this.searchSummaryUpdate_ = setTimeout(() => {
    let searchSummary = document.getElementById('searchSummary');
    if (resultCount === 0) {
      searchSummary.innerText = 'No results for ' + searchInput;
    } else if (searchInput === '') {
      searchSummary.innerText = '';
    } else {
      searchSummary.innerText = 'Top result ' + topResult + '. ' + resultCount +
          (resultCount === 1 ? ' result for ' : ' results for ') + searchInput;
    }
  }, 200);
};

new OptionsPage();

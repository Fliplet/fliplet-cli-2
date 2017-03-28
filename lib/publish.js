const rp = require('request-promise');
const configstore = require('./configstore');
const config = require('./config');
const fs = require('fs');
const archiver = require('archiver');
const temp = require('temp');

function publish() {
  console.log('Publishing...');

  var email = configstore.get('email');
  console.log(email);
  var auth_token = configstore.get('auth_token');
  var organization = configstore.get('organization');

  if (!email || !auth_token) {
    return Promise.reject('You must log in first with: fliplet login');
  }

  var tempName = temp.path({ suffix: '.zip' });
  var output = fs.createWriteStream(tempName);
  var archive = archiver('zip');

  return new Promise(function (resolve, reject) {
    archive.on('error', function(err) {
      throw err;
    });

    archive.on('end', function(err) {
      var zip = fs.createReadStream(tempName);

      var formData = {
        my_file: zip
      };

      if (organization) {
        formData.organizationId = organization.id;
      }

      const options = {
        method: 'POST',
        json: true,
        url: config.api_url + 'v1/widgets?auth_token=' + auth_token,
        formData: formData,
        timeout: 1000 * 60 * 5 // 5 minutes
      };

      return rp(options)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          if (err === 'organizationId is not valid') {
            reject('You must set an organization you belong to with: fliplet organization');
          }

          reject(error);
        });

        // Remove temporary file
        fs.unlinkSync(tempName);
      });

    archive.pipe(output);

    archive
      .bulk([
        {
          cwd: './',
          src: ['**/*', '!.git/**', '!.gitignore'],
          expand: true,
          dest: ''
        }
      ])
      .finalize();
  });
}

module.exports.run = publish;
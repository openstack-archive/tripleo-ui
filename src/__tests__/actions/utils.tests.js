import { generateDownloadUrl } from '../../js/actions/utils';

describe('generateDownloadUrl', () => {
  it('correctly combines swiftUrl and tempurl', () => {
    const tempurl =
      'https://192.168.24.2:13808/v1/AUTH_b37a1bf96c6645618bd0067556f95079/plan-exports/overcloud.tar.gz?temp_url_sig=bf9ee05155229d7340e6781e07058404bbc8ef4e&temp_url_expires=1536141784';
    const swiftUrl =
      'https://192.168.24.2:443/swift/v1/AUTH_b37a1bf96c6645618bd0067556f95079';
    const expectedDownloadUrl =
      'https://192.168.24.2:443/swift/v1/AUTH_b37a1bf96c6645618bd0067556f95079/plan-exports/overcloud.tar.gz?temp_url_sig=bf9ee05155229d7340e6781e07058404bbc8ef4e&temp_url_expires=1536141784';
    expect(generateDownloadUrl(tempurl, swiftUrl)).toEqual(expectedDownloadUrl);
  });
});

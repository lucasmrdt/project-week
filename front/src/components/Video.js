import React from 'react';
import { css, StyleSheet } from 'aphrodite';



const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Video = () => {
  return (
    <div className={css(styles.container)}>
      <video controls>
        <source src='https://r2---sn-25ge7nsd.googlevideo.com/videoplayback?id=o-AKxSXd6beyPM6YTNduk6x18ypkwx0HOEhAlLuwM5ur-M&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&itag=135&source=youtube&requiressl=yes&pl=16&ei=XVvQXNLSDY2yVMOttEA&gcr=fr&mime=video%2Fmp4&gir=yes&clen=6416832&dur=76.960&lmt=1494490888283187&fvip=2&keepalive=yes&c=WEB&ip=163.5.101.210&ipbits=0&expire=1557180349&sparams=aitags,clen,dur,ei,expire,gcr,gir,id,ip,ipbits,ipbypass,lmt,mime,mm,mn,ms,mv,pl,requiressl,source&signature=0578A7B653A09E56D200FDF02704BD0193B2162D.1526ACAE8EEE637AD99FA9765FD68F76F3246829&key=cms1&redirect_counter=1&cm2rm=sn-upoxu-25gs7l&req_id=89226d676213a3ee&cms_redirect=yes&ipbypass=yes&mm=29&mn=sn-25ge7nsd&ms=rdu&mt=1557158963&mv=m' type='video/mp4' />
      </video>
    </div>
  );
};

export default Video;

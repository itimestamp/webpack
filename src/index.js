// import './css/index.less';
// import './css/index1.css'; // 引入 iconfont 样式文件
//
// import './assets/fonts/iconfont.css'; // import data from  './assets/data.json';
import $ from 'jquery';
import index1 from './index1';
import index2 from './index2';

index1();
index2();

function wang(x, y) {
  console.log(x, y, '1111');
}

index1();
index2();
wang(1, 2);
console.log($); // new Promise(((res, rej) => {
//   setTimeout(() => {
//     res(100);
//   }, 1000);
// })).then((v) => console.log(v));
// 注册serviceWorker
// 处理兼容性问题

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
      console.log('sw注册成功了~');
    }).catch(() => {
      console.log('sw注册失败了~');
    });
  });
}

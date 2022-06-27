// let source_lrc = ` Cold Inside
// [00:01.34] 
// [00:01.43] When you lose your time
// [00:05.87] You think it will be enough
// [00:09.22] In a cage of your life
// [00:13.08] Someday it will make you laugh.
// [00:15.73] 
// [00:16.21] I can’t deny
// [00:18.06] That I would find
// [00:21.08] A way to fight
// [00:23.82] My innocence
// [00:25.57] Is my defense
// [00:29.32] 
// [00:31.15] When I go on again,
// [00:33.00] Even you say I can
// [00:34.78] do what I want if it makes me die
// [00:38.91] This cold night
// [00:40.80] I'm cold inside
// [00:42.77] I want it all this night
// [00:46.62] 
// [00:46.86] When I go on again,
// [00:48.21] Even you say I can
// [00:50.33] do what I want if it makes me die
// [00:54.03] This cold night
// [00:55.69] I'm cold inside
// [00:57.65] I want it all this night
// [01:03.55] 
// [01:07.63] Praying down on my knees
// [01:12.02] I'm asking myself and God
// [01:15.55] Why I lost in tears
// [01:19.91] Of enveloping evil fog.
// [01:22.36] 
// [01:22.85] I can’t deny
// [01:24.39] That I would find
// [01:27.15] A way to fight
// [01:30.11] My innocence
// [01:32.20] Is my defense
// [01:35.49] 
// [01:37.63] When I go on again,
// [01:39.06] Even you say I can
// [01:41.03] do what I want if it makes me die
// [01:45.19] This cold night
// [01:47.21] I'm cold inside
// [01:49.31] I want it all this night
// [01:52.63] 
// [01:53.02] When I go on again,
// [01:54.47] Even you say I can
// [01:56.30] do what I want if it makes me die
// [02:00.47] This cold night
// [02:02.37] I'm cold inside
// [02:04.43] I want it all this night
// [02:13.97] 
// [02:34.88] I'm cold inside
// [02:49.13] 
// [03:05.78] When you lose your time
// [03:09.52] You think it will be enough
 
//  `;

let source_lrc = '';
let source_lrc_obj = source_lrc.split('\n');
source_lrc_obj = source_lrc_obj.map(a => {
    let m = a.match(/(\[[^\]]+\])(.*)/);
    if (m) { return [m[2], m[1]] } else { return null }
}).filter(Boolean);

let minify_obj = {};
source_lrc_obj.map(ar => {
    let k = ar[0]; v = ar[1];
    if (!(k in minify_obj)) {
        minify_obj[k] = [];
    }
    minify_obj[k].push(v);
});

let result = '';
Object.keys(minify_obj).map(k => {
    result += minify_obj[k].join(' ') + k + '\n';
});

console.log(result);
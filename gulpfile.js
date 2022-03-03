const fs = require('fs');

const replace = require('gulp-replace');
const gulp = require('gulp');
const git = require('gulp-git');
const path = require('path');
const moment = require('moment');
const zip = require('gulp-zip');
const GulpSSH = require('gulp-ssh');

const dirIndex = path.resolve(__dirname, './apps/integrador/src');
const fileIndex = path.join(dirIndex, 'index.html');

const pathRemoto = '/usr/share/nginx/e-renta.sunat.gob.pe/app/recaudacion/declapago/internet/formularios/';
const sshConfig = {
  host: '192.168.46.55',
  port: 22,
  username: 'root',
  password: 'dgit2015'
};

const gulpSSH = new GulpSSH({sshConfig});

gulp.task('cambiar-version', (cb) => {
  return gulp
    .src([fileIndex])
    .pipe(replace(/VERSION v(\d+.\d+.\d+) - (\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d)/g, (match) => {
      const matches = /VERSION v(\d+.\d+.\d+) - (\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d)/g.exec(match);
      const version = matches[1];
      const fecha = matches[2];
      const listVersion = version.split('.').map((v) => +v);
      listVersion[listVersion.length - 1]++;
      const newVersion = listVersion.join('.');
      const newDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const remplazo = match.replace(version, newVersion);
      const repaceDate = remplazo.replace(fecha, newDate);
      console.log(`nueva version: ${repaceDate}`);
      return repaceDate;
    }))
    .pipe(gulp.dest(dirIndex));
});

gulp.task('generar-commit', (cb) => {
  return gulp.src('./').pipe(git.add()).pipe(git.commit('cambio de version'));
});

gulp.task('generar-tag', (cb) => {
  const data = fs.readFileSync(fileIndex, 'utf8');
  const matches = /VERSION v(\d+.\d+.\d+) - (\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d)/g.exec(data);
  const version = matches[1];
  const newDate = moment().format('YYYY-MM-DD HH:mm:ss');
  git.tag('v' + version, newDate,  (err) => {
    if (err) throw err;
  });
  cb();
});

gulp.task('enviar-push', (cb) => {
  git.push('origin'/* , ['2020-001'] */, {args: " --tags"}, (err) => {
    if (err) throw err;
  });
  cb();
});

gulp.task('generar-zip', () => {
  
  return gulp.src('./dist/app/**')
    .pipe(zip('formulario.zip'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('clean-integracion', () => {
  return gulpSSH.shell([`cd  ${pathRemoto}`, 'rm -rf *']);
});

gulp.task('up-integracion', () => {
  return gulp
    .src(['./dist/app/recaudacion/declapago/internet/formularios/**'])
    .pipe(gulpSSH.dest(pathRemoto))

});

gulp.task(
  'deploy-integracion',
  gulp.series('clean-integracion', 'up-integracion')
);


gulp.task(
  'preparar-version',
  gulp.series(
    'cambiar-version', 
    'generar-commit', 
    'generar-tag',
    'enviar-push'
  )
);

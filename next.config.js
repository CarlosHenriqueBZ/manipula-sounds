/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const withTM = require('next-transpile-modules')(['@iconscout/react-unicons']);

module.exports = withTM(
  withPWA({
    reactStrictMode: true,
  })
);
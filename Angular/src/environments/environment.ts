/**
 * baseURL
 *  while developing locally: "http://localhost:3002"
 *  while deploying remotely: ""
 *
 *  also when deploying:
 *   delete proxy.conf.json from angular.json under serve > options when deploying
 */

export const environment = {
  baseURL: "http://localhost:3002", //backend url
  timeout: 1000,
}

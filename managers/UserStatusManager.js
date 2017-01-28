/**
 * Created by Shihao on 1/27/17.
 */
function UserStatusManager (redisClient) {
    this.redisClient = redisClient;
    this.online_users_key = 'online_users';
}

UserStatusManager.prototype.handleError = function(err){
  console.error(err);
};

UserStatusManager.prototype.userLogin = function(uid,sid) {
    console.log('UserStatusManager.userLogin');
    return this.redisClient.saddAsync(this.online_users_key, uid).catch(this.handleError);

};

UserStatusManager.prototype.userLogoff = function(uid) {
    console.log('UserStatusManager.userLogoff');
    if (uid == undefined){ return;}
    return this.redisClient.sremAsync(this.online_users_key, uid).catch(this.handleError);
};

UserStatusManager.prototype.isUserOnline = function(uid) {
    console.log('UserStatusManager.isUserOnline');
    return this.redisClient.sismemberAsync(this.online_users_key, uid).catch(this.handleError);
};

module.exports = UserStatusManager;
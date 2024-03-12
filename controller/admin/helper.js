// Check if payload role is ADMIN before entering to admin accessible controller

function checkIsAdmin(data) {
    return data.role === 'admin';
}

module.exports = {
    checkIsAdmin
}
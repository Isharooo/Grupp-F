<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Logga in - GRFood</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/login.css">
</head>
<body>
<!-- Bakgrundscirklar -->
<div class="circle blue-circle"></div>
<div class="circle orange-circle"></div>
<div class="circle green-circle"></div>

<!-- Logotyp -->
<div class="logo-container">
    <img src="${url.resourcesPath}/img/GRfoodABOrderLogo.png" alt="GRFood Logo" class="logo" />
</div>

<!-- Loginbox -->
<div class="login-box">
    <form id="kc-form-login" method="post" action="${url.loginAction}">
        <div class="mb">
            <input id="username" name="username" class="input-field" placeholder="Username" autofocus>
        </div>

        <div class="mb">
            <input id="password" name="password" type="password" class="input-field" placeholder="Password">
        </div>

        <#if message?has_content>
            <div class="error-message">
                ${kcSanitize(message.summary)}
            </div>
        </#if>

        <div class="mb">
            <input type="submit" class="button" id="login" value="Log in">
        </div>
    </form>
</div>
</body>
</html>

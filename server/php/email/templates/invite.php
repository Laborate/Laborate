<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <style style="text/css">
            html, body {
                margin: 0px;
                padding: 0px;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }

            .button {
                font-size: 14px;
                cursor: pointer;
                padding: 3px 10px;
                -moz-border-radius: 3px;
                border-radius: 3px;
                font-weight: bold;
                opacity: 0.8;
                text-align: center;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                margin-top: 20px;
            }

            .button:hover { opacity: 1; }

            .blue {
                color: #fff;
                border: solid 1px #0471ed;
                box-shadow: inset 0px 1px 0px #80d6ff;
                background: -webkit-linear-gradient(#00acff 0%, #0078ff 100%);
                background: -moz-linear-gradient(#00acff 0%, #0078ff 100%);
                background: -ms-linear-gradient(#00acff 0%, #0078ff 100%);
                background: -o-linear-gradient(#00acff 0%, #0078ff 100%);
            }

            #core {
                float: left;
                margin-left: 20px;

            }

            #logo {
                width: 100%;
                text-align: center;
                font-size: 24px;
                margin: 30px 0px 5px 0px;
                font-family: "Not Just Groovy";
             }

            #name {
                color: #394a51;

            }

            #wrapper {
                padding: 20px;
                background: #f8f8f8;
                border: thin solid #CCC;
                width: 250px;
                -moz-border-radius: 5px;
                border-radius: 5px;
                color: #516067;
                font-size: 16px;
                text-align: left;
            }

            #addtional {
                margin-top: 15px;
                display: block;
                text-align: left;
            }

            #addtional_header { font-weight: bold; }
        </style>
    </head>
    <body>
        <div id="core">
            <div id="logo">code-laborate</div>
            <div id="wrapper">Brian Vallelunga has invited you to work on <span id="name"><?php echo $file_name; ?></span>.
                <?php if(!is_null($additional_message)) { ?>
                    <div id="addtional">
                        <div id="addtional_header">Additional Message:</div>
                        <div><?php echo $additional_message; ?></div>
                    </div>
                <?php } ?>
                <div class="button blue">Start Codelaborating</div>
            </div>
        </div>
    </body>
</html>
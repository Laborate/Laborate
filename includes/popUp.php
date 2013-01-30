<div id="popup" class="light_grey hidden">
    <div id="popup_header">
        <div id="popup_header_name" class="left"></div>
        <div id="popup_header_exit" class="right">X</div>
        <div class="clear"></div>
    </div>
    <div class="presets" id="location_add">
        <form>
            <table width="100%" cellpadding="0px" cellspacing="0px">
                <tr>
                    <td width="85">Name:</td>
                    <td><input type="text" class="input full" id="popup_location_name" name="location_name" placeholder="Dev Site"/></td>
                </tr>
                <tr>
                    <td width="85">Type:</td>
                    <td>
                        <select id="popup_location_type" class="select full">
                            <option value="ftp">FTP</option>
                            <option value="sftp">SFTP</option>
                            <option value="github">Github Repository</option>
                        </select>
                    </td>
                </tr>
            </table>
            <div id="popup_location_ftp" class="selection">
                <table width="100%" cellpadding="0px" cellspacing="0px">
                    <tr>
                        <td width="85">Server:</td>
                        <td><input type="text" class="input full" id="popup_location_server" name="ftp_server" placeholder="192.168.1.1"/></td>
                    </tr>
                    <tr>
                        <td width="85">Username:</td>
                        <td><input type="text" class="input full" id="popup_location_username" name="ftp_user_name" placeholder="john"/></td>
                    </tr>
                    <tr>
                        <td width="85">Password:</td>
                        <td><input type="password" class="input full" id="popup_location_user_password" name="ftp_user_password" placeholder=""/></td>
                    </tr>
                </table>
            </div>
            <div id="popup_location_github" class="hidden selection scroll">
                <ul>
                    <li>bvallelunga/<span class="bold">technologic</span></li>
                    <li>ParkMeInc/<span class="bold">middleware</span></li>
                    <li>ParkMeInc/<span class="bold">homepage</span></li>
                    <li>ParkMeInc/<span class="bold">AndroidAttendant</span></li>
                    <li>ParkMeInc/<span class="bold">AndroidConsumer</span></li>
                    <li>ParkMeInc/<span class="bold">AndroidLibs</span></li>
                    <li>ParkMeInc/<span class="bold">iphone</span></li>
                    <li>ParkMeInc/<span class="bold">iphonewebapp</span></li>
                </ul>
            </div>
            <input type="submit" class="button blue full" value="Add Location" />
        </form>
    </div>
    <div class="presets" id="location_remove">
        <input type="button" class="button blue full" value="Yes, I am sure" />
    </div>
</div>
<div id="popup_backdrop" class="hidden"></div>
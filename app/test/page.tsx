"use client";
import React, { useEffect, useState } from "react";

const FetchBSCAddress = () => {
    const [bscAddress, setBscAddress] = useState<string | null>(null);

    useEffect(() => {
        const fetchHtmlAndExtract = async () => {
            try {
                const response = await fetch(
                    "https://cors-anywhere.herokuapp.com/https://basescan.org/name-lookup-search?id=vanshs.base.eth",
                    {
                        method: "GET",
                        headers: {
                            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "en-US,en;q=0.9",
                            "cache-control": "max-age=0",
                            cookie: "ASP.NET_SessionId=feoefocra04fbqnjdvszh20c; basescan_switch_token_amount_value=value; cf_clearance=VKIbeJ9t7Njel37PiFqjSHO.flMeQiEVfxALUPb1A6Q-1731032345-1.2.1.1-.u58OI4dwloKSQeP1Zz6RdvVrXlfZMmGNEDqC36t8b0BJxfb.aPuNMf2atHFVhl5MBHFhtpzqer.CLnnowpDUUF.erUf4WhLDQvFzj8OllD4Vv_6cdOniTSPXPOP0SMC9mAK5Kfc64NTW1s6TgRfnKF84qik.Tf_zDpQcsLeU97ZegBNV7eguA7sV_EVL81dl7SGF_e1sAq.vtcW_lpFCbZwRyFVzt2SNSK54O6gIy4FBXHtHFZzO9JJRUsgh9UpAVAGjKINqanunLQBJDMwQ6Qp7kB.ow8tUYrxZFr0J_LgA12DOTDIoVgn5SKIGB1hzGokYTemN1RL5DZ1z.1dkIAFjZeJKJNmMh5zWuLnb3Eq24YZLnNae9Q0aUXL5IxJnhV98nFUEZcRF8_slUzd5kPhBH1No67TWLLdveqslCE69OMDHZX9jOEJwxbTuRYb; basescan_pwd=4792:Qdxb:JnSaGTfjtdaESCnHwKYQyez3eEW52tE3kb9Ma4a1cP51JnKDpJfXsmCFO6GMM0+u; basescan_userid=pranav; basescan_autologin=True; __cflb=02DiuJ1fCRi484mKRwML12UraygpucsyTWc9pZJeZ3Txx; basescan_offset_datetime=+5.5",
                            dnt: "1",
                            priority: "u=0, i",
                            referer: "https://basescan.org/",
                            "sec-ch-ua":
                                '"Chromium";v="131", "Not_A Brand";v="24"',
                            "sec-ch-ua-arch": '"arm"',
                            "sec-ch-ua-bitness": '"64"',
                            "sec-ch-ua-full-version": '"131.0.6778.86"',
                            "sec-ch-ua-full-version-list":
                                '"Chromium";v="131.0.6778.86", "Not_A Brand";v="24.0.0.0"',
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-model": '""',
                            "sec-ch-ua-platform": '"macOS"',
                            "sec-ch-ua-platform-version": '"15.1.0"',
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "user-agent":
                                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                        },
                    }
                );

                const text = await response.text();
                // Use a regular expression to extract the inner HTML of the element with id="spanBSCAddress"
                const regex = /<span id="spanBSCAddress">([\s\S]*?)<\/span>/;
                const match = text.match(regex);

                if (match && match[1]) {
                    setBscAddress(match[1]); // Set the extracted inner HTML
                } else {
                    console.log('No element with id="spanBSCAddress" found.');
                }
            } catch (error) {
                console.error("Error fetching HTML:", error);
            }
        };

        fetchHtmlAndExtract();
    }, []);

    return (
        <div>
            {bscAddress ? (
                <p>Inner HTML of spanBSCAddress: {bscAddress}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default FetchBSCAddress;

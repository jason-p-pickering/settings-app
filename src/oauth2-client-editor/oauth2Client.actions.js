import {Action} from 'd2-flux';
import {getInstance as getD2} from 'd2/lib/d2';

import oa2Store from './oauth2Client.store';

const oa2Actions = Action.createActionsFromNames(['load', 'delete']);

oa2Actions.load.subscribe(() => {
    getD2()
        .then(d2 => {
            d2.models.oAuth2Client.list({paging: false, fields: ':all'})
                .then(oa2ClientCollection => {
                    const yes = d2.i18n.getTranslation('yes');
                    const no = d2.i18n.getTranslation('no');
                    oa2Store.setState(oa2ClientCollection.toArray().map(oa2c => {
                        return Object.assign(oa2c,
                            {
                                password: oa2c.grantTypes.indexOf('password') !== -1 ? yes : no,
                                refresh_token: oa2c.grantTypes.indexOf('refresh_token') !== -1 ? yes : no,
                                authorization_code: oa2c.grantTypes.indexOf('authorization_code') !== -1 ? yes : no,
                            });
                    }));
                });
        });
});

oa2Actions.delete.subscribe((e) => {
    e.data.delete()
        .then(() => {
            oa2Store.state.splice(oa2Store.state.indexOf(e.data), 1);
            oa2Store.setState(oa2Store.state);
            window.snackbar.show();
        })
        .catch((err) => {
            log.error('Failed to delete OAuth2 client:', err);
        });
});

export default oa2Actions;

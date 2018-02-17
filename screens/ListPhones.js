import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Header, Body, Left, Right, Button, Title, List, ListItem, Text } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class ListPhonesScreen
 * @extends Component
 * @description Represents the screen to list the phones of a particular customer.
 */
export default class ListPhonesScreen extends Component {
    constructor(props) {
        super(props);
        let { params } = props.navigation.state;
        this.state = {
            customer: params ? params.customer : null,
            phones: [],
        };
    }

    componentDidMount() {
        this.select();
        this.refreshEventNumbers = Events.subscribe('RefreshNumbers', () => this.select());
    }
    
    componentWillUnmount() {
        this.refreshEventNumbers.remove();
    }
    
    /**
     * 
     * @method ListPhonesScreen#delete
     * @param phone
     * @description Method that deletes some customer's phone from a database.
     */
    delete(phone) {
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('DELETE FROM phone WHERE id = ?', [phone.id]);
        this.select();
    }

    /**
     * 
     * @method ListPhonesScreen#select
     * @description Method that get a customer's phones from the database.
     */
    select() {
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM phone WHERE customer_id = ?;', [this.state.customer.id], (tx, results) => {
                var len = results.rows.length;
                this.setState({ phones: [] });
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let joined = this.state.phones.concat(row);
                    this.setState({ phones: joined });
                }
            });
        });
    }

    errorCB(err) {
        console.error("SQLite3 Error: " + err);
    }

    openCB() {
        console.log("Database OPENED");
    }

    render() {
        let props = this.props;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon name='arrow-back' color='white' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.customer.name}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => props.navigation.navigate('RegisterPhones', { customer: this.state.customer })}>
                            <Icon name='phone-plus' type='material-community' color='white' />
                        </Button>
                    </Right>
                </Header>
                <List dataArray={this.state.phones}
                    renderRow={(phone) =>
                        <ListItem
                            onLongPress={
                                () => Alert.alert(
                                    'Atenção!',
                                    'Escolha uma ação a ser executada:',
                                    [
                                        { text: 'Cancelar', onPress: () => console.log('Foi negado uma ação!') },
                                        {
                                            text: 'Apagar', onPress: () => {
                                                this.delete(phone);
                                            }
                                        },
                                        {
                                            text: 'Atualizar', onPress: () => {
                                                props.navigation.navigate('UpdatePhone', { phone: phone, name: this.state.customer.name });
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                )
                            }
                        >
                            <Text>
                                {phone.number}
                            </Text>
                        </ListItem>
                    }>
                </List>
            </Container>
        );
    }
}
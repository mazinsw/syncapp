import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Body, Right, Button, Icon, Title, List, ListItem, Content, Text } from 'native-base';

// SQLite configuration
import SQLite from 'react-native-sqlite-storage';

// Library for events manipulation
import Events from '../utils/events';

/**
 * 
 * @class HomeScreen
 * @extends Component
 * @description Represents the screen initial.
 */
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: []
        };
    }

    componentDidMount() {
        this.select();
        this.refreshEventCustomer = Events.subscribe('RefreshCustomer', () => this.select());
    }

    componentWillUnmount() {
        this.refreshEventCustomer.remove();
    }

    /**
     * 
     * @method HomeScreen#delete
     * @param element
     * @description Method that excludes some database customer.
     */
    delete(element) {
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.executeSql('DELETE FROM customer WHERE id = ?', [element.id]);
        this.select();
    }

    /**
     * 
     * @method HomeScreen#select
     * @description Method that gets a client from the database.
     */
    select() {
        let db = SQLite.openDatabase('syncapp', '1.0', 'SyncApp Database', 200000, this.openCB, this.errorCB);
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM customer', [], (tx, results) => {
                var len = results.rows.length;
                this.setState({ customers: [] });
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let joined = this.state.customers.concat(row);
                    this.setState({ customers: joined });
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
                    <Body>
                        <Title>Clientes</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => props.navigation.navigate('RegisterCustomer')}>
                            <Icon name='person-add' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List dataArray={this.state.customers}
                        renderRow={(item) =>
                            <ListItem
                                onPress={() => props.navigation.navigate('ListPhones', { customer: item })}
                                onLongPress={
                                    () => Alert.alert(
                                        'Atenção!',
                                        'Escolha uma ação a ser executada:',
                                        [
                                            { text: 'Cancelar', onPress: () => console.log('Foi negado uma ação!')},
                                            {
                                                text: 'Apagar', onPress: () => {
                                                    this.delete(item);
                                                }
                                            },
                                            {
                                                text: 'Atualizar', onPress: () => {
                                                    props.navigation.navigate('UpdateCustomer', { customer: item });
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    )
                                }
                            >
                                <Body>
                                    <Text style={{ fontSize: 20 }}>{item.name}</Text>
                                    <Text style={{ color: '#666' }}>{item.code}</Text>
                                </Body>
                            </ListItem>
                        }>
                    </List>
                </Content>
            </Container>
        );
    }
}
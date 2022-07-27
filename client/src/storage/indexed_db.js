window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const DB_CONFIG = {
  DB_NAME: 'GameDatabase',
  DB_VERSION: 1
}

if (!window.indexedDB) {
  console.error("Your browser doesn't support IndexedDB.");
} else {
  const gameDBRequest = window.indexedDB.open(DB_CONFIG.DB_NAME, DB_CONFIG.DB_VERSION)

  /**
   * Such an error might occur when attempting to .open() the database.
   */
  gameDBRequest.onerror = function (event) {
    console.log('onerror::', event)
    console.log(`An error occurred with indexedDB: ${event}`)
  }

  /**
   * The 'upgradeneeded' event is fired when an attempt was made to open a database
   * with a version number higher than its current version.
   * 
   * This event handles the event whereby a new version of
   * the database needs to be created Either one has not
   * been created before, or a new version number has been
   * submitted via the window.indexedDB.open line above
   * it is only implemented in recent browsers.
   */
  gameDBRequest.onupgradeneeded = function (event) {
    console.log('onupgradeneeded::', event)
    const db = event.target.result
    const store = db.createObjectStore('players', { keyPath: 'id' })

    store.createIndex('player_name', ['player_name'], { unique: false })
  }

  /**
   * 
   */
  gameDBRequest.onsuccess = function (event) {
    console.log('onsuccess::', event)
    // const db = gameDBRequest.result
    const db = event.target.result
    const transaction = db.transaction('players', 'readwrite')

    const store = transaction.objectStore('players')
    const nameIndex = store.index('player_name')

    store.put({ id: 1, player_name: 'fake_player_name_idb_11', extra_field: 'play11' })
    store.put({ id: 2, player_name: 'fake_player_name_idb_22', extra_field: 'play22' })
    store.put({ id: 3, player_name: 'fake_player_name_idb_33', extra_field: 'play33' })

    // Do a lookup on the 'keyPath'
    const idQuery = store.get(2)
    const nameQuery = nameIndex.getAll(['fake_player_name_idb_3'])

    idQuery.onsuccess = function () {
      console.log(`idQuery::success::`, idQuery.result)
    }

    nameQuery.onsuccess = function () {
      console.log(`nameQuery::success::`, nameQuery.result)
    }

    transaction.oncomplete = function () {
      db.close()
    }
  }
}
